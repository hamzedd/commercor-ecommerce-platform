import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { OrderItemEntity } from '@/src/libs/models/entities/order/OrderItem.entity';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';
import { AddressEntity } from '@/src/libs/models/entities/customer/Address.entity';
import { CreateOrderDto } from '@/src/libs/models/dtos/orders/CreateOrder.dto';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { DOMAIN_URL } from '@/src/utils/environmentConstants';
import { InjectRepository } from '@nestjs/typeorm';
import { PricingService } from './pricing.service';
import { RewardsService } from '@/src/modules/rewards/rewards.service';
import { OrderStatus, PaymentStatus } from '@/src/utils/enums/PaymentEnums';
import { pendingPaymentExpiresAt } from '@/src/modules/payments/services/payment-expiration.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(OrderEntity)
    private ordersRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private orderItemsRepository: Repository<OrderItemEntity>,
    private readonly pricingService: PricingService,
    private readonly rewardsService: RewardsService,
  ) {}

  async quote(customerId: string, data: CreateOrderDto) {
    const address = await this.dataSource.manager.findOneBy(AddressEntity, {
      id: data.addressId,
      customerId,
    });
    if (!address) throw new BadRequestException('Customer has no address');
    const pricing = await this.pricingService.calculate(
      this.dataSource.manager,
      data.items,
      address.country,
      customerId,
      data.usePoints || 0,
      data.useCashback || 0,
    );
    const { items: _items, ...quote } = pricing;
    return quote;
  }

  async create(customerId: string, data: CreateOrderDto) {
    if (!customerId) throw new BadRequestException('customerId is required');
    if (!data || data?.items?.length === 0)
      throw new BadRequestException('Order must have at least one item');

    return this.dataSource.transaction(async (manager) => {
      const ordersRepo = manager.getRepository(OrderEntity);
      const paymentsRepo = manager.getRepository(PaymentEntity);
      const orderItemsRepo = manager.getRepository(OrderItemEntity);
      const productsRepo = manager.getRepository(ProductEntity);

      const address = await manager.findOneBy(AddressEntity, {
        id: data.addressId,
        customerId,
      });

      if (!address) throw new BadRequestException('Customer has no address');

      const pricing = await this.pricingService.calculate(
        manager,
        data.items,
        address.country,
        customerId,
        data.usePoints || 0,
        data.useCashback || 0,
        true,
      );
      const order = ordersRepo.create({
        customerId,
        addressId: address.id,
        status: OrderStatus.PENDING,
        deliveryAmount: pricing.shippingAmount,
        productAmount: pricing.subtotal,
        taxAmount: pricing.taxAmount,
        finalTotal: pricing.total,
        pointsRedeemed: pricing.pointsRedeemed,
        pointsDiscountAmount: pricing.pointsDiscount,
        cashbackUsed: pricing.cashbackUsed,
      });

      const orderItems: OrderItemEntity[] = [];

      for (const item of pricing.items) {
        const product = item.product;
        product.stock -= item.quantity;
        await productsRepo.save(product);

        orderItems.push(
          orderItemsRepo.create({
            order,
            productId: product.id,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          }),
        );
      }

      let newPayment = paymentsRepo.create({
        totalAmount: pricing.total,
        refundedAmount: 0,
        status: PaymentStatus.PENDING,
        paidAmount: null,
        currencyCode: pricing.currencyCode.toUpperCase(),
        provider: null,
        providerPaymentId: null,
        externalTransactionId: null,
        completedAt: null,
        expiresAt: pendingPaymentExpiresAt(),
        cancellationReason: null,
      });

      newPayment = await paymentsRepo.save(newPayment);

      order.payment = newPayment;
      const savedOrder = await ordersRepo.save(order);

      await this.rewardsService.redeem(
        manager,
        customerId,
        savedOrder.id,
        newPayment.id,
        pricing.pointsRedeemed,
        pricing.pointsDiscount,
        pricing.cashbackUsed,
      );

      await Promise.all(
        orderItems.map((item) =>
          orderItemsRepo.save({
            ...item,
            order: savedOrder,
          }),
        ),
      );

      return {
        paymentId: newPayment.id,
        paymentUrl: `${DOMAIN_URL}/payment-status/${newPayment.id}`,
        subtotal: pricing.subtotal,
        shippingAmount: pricing.shippingAmount,
        taxAmount: pricing.taxAmount,
        pointsRedeemed: pricing.pointsRedeemed,
        pointsDiscount: pricing.pointsDiscount,
        cashbackUsed: pricing.cashbackUsed,
        discountedSubtotal: pricing.discountedSubtotal,
        total: pricing.total,
        currencyCode: pricing.currencyCode,
      };
    });
  }

  async getCustomerOrders(customerId: string) {
    const orders = await this.ordersRepository.find({
      where: { customerId },
    });

    return await Promise.all(
      orders.map(async (order) => ({
        ...order,
        orderItems: await this.orderItemsRepository.find({
          where: {
            orderId: order.id,
          },
          relations: {
            product: {
              translations: true,
              images: true,
            },
          },
        }),
      })),
    );
  }
}
