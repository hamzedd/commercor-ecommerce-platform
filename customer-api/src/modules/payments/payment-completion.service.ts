import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { OrderItemEntity } from '@/src/libs/models/entities/order/OrderItem.entity';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';
import { PaymentStatus, OrderStatus } from '@/src/utils/enums/PaymentEnums';
import { assertCompletion, VerifiedPaymentEvent } from './payment-state';
import { RewardsService } from '@/src/modules/rewards/rewards.service';

@Injectable()
export class PaymentCompletionService {
  constructor(private readonly dataSource: DataSource, private readonly rewards: RewardsService) {}

  async completeVerified(event: VerifiedPaymentEvent) {
    return this.dataSource.transaction(async (manager) => {
      const payment = await manager.getRepository(PaymentEntity).findOne({ where: { id: event.paymentId }, lock: { mode: 'pessimistic_write' } });
      if (!payment) throw new BadRequestException('Payment does not exist');
      const order = await manager.getRepository(OrderEntity).findOne({ where: { paymentId: payment.id }, lock: { mode: 'pessimistic_write' } });
      if (!order) throw new BadRequestException('Payment has no order');
      let action;
      try { action = assertCompletion(payment.status, event, Number(order.finalTotal), payment.currencyCode || event.currencyCode, payment.externalTransactionId); }
      catch (error) { throw new BadRequestException((error as Error).message); }
      if (action === 'duplicate') return { status: payment.status, idempotent: true };
      if (Number(payment.totalAmount) !== Number(order.finalTotal)) throw new BadRequestException('Persisted payment amount does not match order final total');
      Object.assign(payment, { status: PaymentStatus.COMPLETED, paidAmount: Number(event.amount.toFixed(2)), currencyCode: event.currencyCode.toUpperCase(), provider: event.provider, externalTransactionId: event.externalTransactionId, completedAt: new Date() });
      order.status = OrderStatus.COMPLETED;
      await manager.getRepository(PaymentEntity).save(payment);
      await manager.getRepository(OrderEntity).save(order);
      await this.rewards.grant(manager, order.customerId, order.id, payment.id, Math.max(0, Number(order.productAmount) - Number(order.pointsDiscountAmount) - Number(order.cashbackUsed)));
      return { status: payment.status, idempotent: false };
    });
  }

  async failVerified(event: { paymentId: string; provider: string; externalTransactionId: string; status: PaymentStatus.FAILED | PaymentStatus.CANCELLED }) {
    return this.dataSource.transaction(async (manager) => {
      const payment = await manager.getRepository(PaymentEntity).findOne({ where: { id: event.paymentId }, lock: { mode: 'pessimistic_write' } });
      if (!payment) throw new BadRequestException('Payment does not exist');
      if (payment.status === event.status && payment.externalTransactionId === event.externalTransactionId) return { status: payment.status, idempotent: true };
      if (payment.status !== PaymentStatus.PENDING) throw new BadRequestException(`Invalid payment transition: ${payment.status} -> ${event.status}`);
      const order = await manager.getRepository(OrderEntity).findOne({ where: { paymentId: payment.id }, lock: { mode: 'pessimistic_write' } });
      if (!order) throw new BadRequestException('Payment has no order');
      payment.status = event.status; payment.provider = event.provider; payment.externalTransactionId = event.externalTransactionId;
      order.status = event.status === PaymentStatus.FAILED ? OrderStatus.FAILED : OrderStatus.CANCELLED;
      await this.rewards.restoreRedemption(manager, order.customerId, order.id, payment.id, order.pointsRedeemed, Number(order.cashbackUsed), 'Redeemed rewards restored after failed payment');
      for (const item of await manager.getRepository(OrderItemEntity).findBy({ orderId: order.id })) {
        const product = await manager.getRepository(ProductEntity).findOne({ where: { id: item.productId }, lock: { mode: 'pessimistic_write' } });
        if (product) { product.stock += item.quantity; await manager.getRepository(ProductEntity).save(product); }
      }
      await manager.getRepository(PaymentEntity).save(payment); await manager.getRepository(OrderEntity).save(order);
      return { status: payment.status, idempotent: false };
    });
  }
}
