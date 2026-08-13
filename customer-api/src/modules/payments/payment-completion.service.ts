import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { OrderItemEntity } from '@/src/libs/models/entities/order/OrderItem.entity';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';
import { PaymentStatus, OrderStatus } from '@/src/utils/enums/PaymentEnums';
import { assertCompletion, VerifiedPaymentEvent } from './payment-state';
import { RewardsService } from '@/src/modules/rewards/rewards.service';
import { CouponEntity } from '@/src/libs/models/entities/coupon/Coupon.entity';
import { CouponUsageEntity } from '@/src/libs/models/entities/coupon/CouponUsage.entity';
import { ProductVariantEntity } from '@/src/libs/models/entities/product/ProductVariant.entity';
import { NotificationService } from '@/src/modules/notifications/notification.service';
import { InvoicesService } from '@/src/modules/invoices/invoices.service';
import { InventoryService } from '@/src/modules/inventory/inventory.service';
import { InventoryMovementType } from '@/src/libs/models/entities/inventory/InventoryMovement.entity';
import { CartService } from '@/src/modules/cart/cart.service';

@Injectable()
export class PaymentCompletionService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly rewards: RewardsService,
    private readonly notifications: NotificationService,
    private readonly invoices: InvoicesService,
    private readonly inventory: InventoryService,
    private readonly carts: CartService,
  ) {}

  async completeVerified(event: VerifiedPaymentEvent) {
    return this.dataSource.transaction(async (manager) => {
      const payment = await manager.getRepository(PaymentEntity).findOne({
        where: { id: event.paymentId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!payment) throw new BadRequestException('Payment does not exist');
      const order = await manager.getRepository(OrderEntity).findOne({
        where: { paymentId: payment.id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!order) throw new BadRequestException('Payment has no order');
      let action;
      try {
        action = assertCompletion(
          payment.status,
          event,
          Number(order.finalTotal),
          payment.currencyCode || event.currencyCode,
          payment.externalTransactionId,
        );
      } catch (error) {
        throw new BadRequestException((error as Error).message);
      }
      if (action === 'duplicate')
        return { status: payment.status, idempotent: true };
      if (Number(payment.totalAmount) !== Number(order.finalTotal))
        throw new BadRequestException(
          'Persisted payment amount does not match order final total',
        );
      Object.assign(payment, {
        status: PaymentStatus.COMPLETED,
        paidAmount: Number(event.amount.toFixed(2)),
        currencyCode: event.currencyCode.toUpperCase(),
        provider: event.provider,
        externalTransactionId: event.externalTransactionId,
        completedAt: new Date(),
      });
      order.status = OrderStatus.COMPLETED;
      await manager.getRepository(PaymentEntity).save(payment);
      await manager.getRepository(OrderEntity).save(order);
      if (order.couponId) {
        const coupon = await manager.getRepository(CouponEntity).findOne({
          where: { id: order.couponId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!coupon)
          throw new BadRequestException('Order coupon no longer exists');
        if (
          !(await manager
            .getRepository(CouponUsageEntity)
            .existsBy({ orderId: order.id }))
        ) {
          if (
            coupon.usageLimit != null &&
            coupon.totalUsageCount >= coupon.usageLimit
          )
            throw new BadRequestException(
              'Coupon usage limit has been reached',
            );
          const customerCount = await manager
            .getRepository(CouponUsageEntity)
            .countBy({ couponId: coupon.id, customerId: order.customerId });
          if (
            coupon.usageLimitPerCustomer != null &&
            customerCount >= coupon.usageLimitPerCustomer
          )
            throw new BadRequestException(
              'Coupon customer usage limit has been reached',
            );
          await manager.getRepository(CouponUsageEntity).save(
            manager.getRepository(CouponUsageEntity).create({
              couponId: coupon.id,
              customerId: order.customerId,
              orderId: order.id,
              discountAmount: Number(order.couponDiscountAmount),
            }),
          );
          coupon.totalUsageCount += 1;
          await manager.getRepository(CouponEntity).save(coupon);
        }
      }
      await this.rewards.grant(
        manager,
        order.customerId,
        order.id,
        payment.id,
        Math.max(
          0,
          Number(order.productAmount) -
            Number(order.couponDiscountAmount) -
            Number(order.pointsDiscountAmount) -
            Number(order.cashbackUsed),
        ),
      );
      const invoice = await this.invoices.issue(manager, order, payment);
      await this.notifications.queue(
        manager,
        'payment_completed',
        `payment_completed:${payment.id}`,
        order,
        {
          amount: event.amount,
          currencyCode: event.currencyCode,
          provider: event.provider,
          invoiceNumber: invoice.invoiceNumber,
          invoiceId: invoice.id,
        },
      );
      await this.carts.convert(manager, order.customerId, order.id);
      return { status: payment.status, idempotent: false };
    });
  }

  async failVerified(event: {
    paymentId: string;
    provider: string;
    externalTransactionId: string;
    status: PaymentStatus.FAILED | PaymentStatus.CANCELLED;
  }) {
    return this.dataSource.transaction(async (manager) => {
      const payment = await manager.getRepository(PaymentEntity).findOne({
        where: { id: event.paymentId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!payment) throw new BadRequestException('Payment does not exist');
      if (
        payment.status === event.status &&
        payment.externalTransactionId === event.externalTransactionId
      )
        return { status: payment.status, idempotent: true };
      if (payment.status !== PaymentStatus.PENDING)
        throw new BadRequestException(
          `Invalid payment transition: ${payment.status} -> ${event.status}`,
        );
      const order = await manager.getRepository(OrderEntity).findOne({
        where: { paymentId: payment.id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!order) throw new BadRequestException('Payment has no order');
      payment.status = event.status;
      payment.provider = event.provider;
      payment.externalTransactionId = event.externalTransactionId;
      order.status =
        event.status === PaymentStatus.FAILED
          ? OrderStatus.FAILED
          : OrderStatus.CANCELLED;
      order.fulfillmentStatus = 'cancelled';
      order.cancelledAt = new Date();
      await this.rewards.restoreRedemption(
        manager,
        order.customerId,
        order.id,
        payment.id,
        order.pointsRedeemed,
        Number(order.cashbackUsed),
        'Redeemed rewards restored after failed payment',
      );
      for (const item of await manager
        .getRepository(OrderItemEntity)
        .findBy({ orderId: order.id })) {
        await this.inventory.change(manager, {
          productId: item.productId,
          variantId: item.variantId,
          delta: item.quantity,
          type: InventoryMovementType.ORDER_RESTORE,
          orderId: order.id,
          reason: 'Payment failed or cancelled',
          referenceKey: `order_restore:${order.id}:${item.id}`,
        });
      }
      await manager.getRepository(PaymentEntity).save(payment);
      await manager.getRepository(OrderEntity).save(order);
      await this.notifications.queue(
        manager,
        event.status === PaymentStatus.FAILED
          ? 'payment_failed'
          : 'order_cancelled',
        `payment_terminal:${payment.id}:${event.status}`,
        order,
        {},
      );
      await this.carts.releaseCheckout(manager, order.customerId, order.id);
      return { status: payment.status, idempotent: false };
    });
  }
}
