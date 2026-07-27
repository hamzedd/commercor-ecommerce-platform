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

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(OrderEntity)
    private ordersRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private orderItemsRepository: Repository<OrderItemEntity>,
  ) {}

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

      const order = ordersRepo.create({
        customerId,
        addressId: address.id,
        status: 'completed',
        deliveryAmount: 0,
        productAmount: 0,
      });

      let totalAmount = 0;

      const orderItems: OrderItemEntity[] = [];

      for (const item of data.items) {
        const product = await manager.findOne(ProductEntity, {
          where: { id: item.productId },
          lock: { mode: 'pessimistic_write' },
        });

        if (!product)
          throw new NotFoundException(`Product not found: ${item.productId}`);
        if (product.stock < item.quantity)
          throw new BadRequestException(
            `Not enough stock for product ${product.id}`,
          );

        product.stock -= item.quantity;
        await productsRepo.save(product);

        const unitPrice = parseFloat(product.price.toString());

        orderItems.push(
          orderItemsRepo.create({
            order,
            productId: product.id,
            quantity: item.quantity,
            unitPrice,
          }),
        );

        totalAmount += unitPrice * item.quantity;
      }

      let newPayment = paymentsRepo.create({
        totalAmount: order.deliveryAmount + order.productAmount,
        refundedAmount: 0,
        status: 'completed',
      });

      newPayment = await paymentsRepo.save(newPayment);

      order.productAmount = Number(totalAmount.toFixed(2));
      order.payment = newPayment;
      const savedOrder = await ordersRepo.save(order);

      await Promise.all(
        orderItems.map((item) =>
          orderItemsRepo.save({
            ...item,
            order: savedOrder,
          }),
        ),
      );

      return {
        paymentUrl: `${DOMAIN_URL}/payment-status/${newPayment.id}`,
      };
    });
  }

  async getCustomerOrders(customerId: string) {
    const orders = await this.ordersRepository.find({
      where: { customerId, status: 'completed' },
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
