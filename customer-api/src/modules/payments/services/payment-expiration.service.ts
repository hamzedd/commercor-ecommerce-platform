import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { OrderItemEntity } from '@/src/libs/models/entities/order/OrderItem.entity';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';
import { OrderStatus, PaymentStatus } from '@/src/utils/enums/PaymentEnums';
import { RewardsService } from '@/src/modules/rewards/rewards.service';
import { PAYMENT_PENDING_EXPIRY_MINUTES } from '@/src/utils/environmentConstants';
import { ProductVariantEntity } from '@/src/libs/models/entities/product/ProductVariant.entity';

export const PAYMENT_EXPIRATION_REASON = 'pending_payment_expired';

export function pendingPaymentExpiresAt(now = Date.now()) {
  return new Date(now + PAYMENT_PENDING_EXPIRY_MINUTES * 60_000);
}

export function shouldExpirePayment(
  payment: Pick<PaymentEntity, 'status' | 'expiresAt'>,
  now: Date,
) {
  return (
    payment.status === PaymentStatus.PENDING &&
    payment.expiresAt !== null &&
    payment.expiresAt.getTime() <= now.getTime()
  );
}

@Injectable()
export class PaymentExpirationService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly rewards: RewardsService,
  ) {}

  async expirePendingPayments(
    now = new Date(),
    batchSize = 50,
  ): Promise<number> {
    if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > 500) {
      throw new Error('Expiration batch size must be between 1 and 500');
    }

    return this.dataSource.transaction(async (manager) => {
      const payments = await manager
        .getRepository(PaymentEntity)
        .createQueryBuilder('payment')
        .setLock('pessimistic_write')
        .setOnLocked('skip_locked')
        .where('payment.status = :status', { status: PaymentStatus.PENDING })
        .andWhere('payment.expiresAt IS NOT NULL')
        .andWhere('payment.expiresAt <= :now', { now })
        .orderBy('payment.expiresAt', 'ASC')
        .take(batchSize)
        .getMany();

      let expired = 0;
      for (const payment of payments) {
        if (await this.expireLocked(manager, payment, now)) expired += 1;
      }
      return expired;
    });
  }

  private async expireLocked(
    manager: EntityManager,
    payment: PaymentEntity,
    now: Date,
  ): Promise<boolean> {
    if (!shouldExpirePayment(payment, now)) return false;
    const order = await manager.getRepository(OrderEntity).findOne({
      where: { paymentId: payment.id },
      lock: { mode: 'pessimistic_write' },
    });
    if (!order) return false;

    payment.status = PaymentStatus.CANCELLED;
    payment.cancellationReason = PAYMENT_EXPIRATION_REASON;
    order.status = OrderStatus.CANCELLED;

    await this.rewards.restoreRedemption(
      manager,
      order.customerId,
      order.id,
      payment.id,
      order.pointsRedeemed,
      Number(order.cashbackUsed),
      'Redeemed rewards restored after payment expiration',
    );

    const items = await manager
      .getRepository(OrderItemEntity)
      .findBy({ orderId: order.id });
    for (const item of items) {
      if(item.variantId){const variant=await manager.getRepository(ProductVariantEntity).findOne({where:{id:item.variantId},lock:{mode:'pessimistic_write'}});if(variant){variant.stock+=item.quantity;await manager.getRepository(ProductVariantEntity).save(variant);}continue;}
      const product = await manager.getRepository(ProductEntity).findOne({
        where: { id: item.productId },
        lock: { mode: 'pessimistic_write' },
      });
      if (product) {
        product.stock += item.quantity;
        await manager.getRepository(ProductEntity).save(product);
      }
    }

    await manager.getRepository(PaymentEntity).save(payment);
    await manager.getRepository(OrderEntity).save(order);
    return true;
  }
}
