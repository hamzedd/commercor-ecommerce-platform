import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { OrderItemEntity } from '@/src/libs/models/entities/order/OrderItem.entity';
import { OrderStatus, PaymentStatus } from '@/src/utils/enums/PaymentEnums';
import { RewardsService } from '@/src/modules/rewards/rewards.service';
import { PAYMENT_PENDING_EXPIRY_MINUTES } from '@/src/utils/environmentConstants';
import { NotificationService } from '@/src/modules/notifications/notification.service';
import { InventoryService } from '@/src/modules/inventory/inventory.service';
import { InventoryMovementType } from '@/src/libs/models/entities/inventory/InventoryMovement.entity';
import {
  CartEntity,
  CartStatus,
} from '@/src/libs/models/entities/cart/Cart.entity';
import { isCheckoutPaymentActive } from '../payment-checkout-state';
import { MANUAL_PAYMENT_PROVIDER_NAME } from '../providers/manual.provider';

export const PAYMENT_EXPIRATION_REASON = 'pending_payment_expired';

export function pendingPaymentExpiresAt(now = Date.now()) {
  return new Date(now + PAYMENT_PENDING_EXPIRY_MINUTES * 60_000);
}

export function shouldExpirePayment(
  payment: Pick<PaymentEntity, 'status' | 'expiresAt'>,
  now: Date,
) {
  return (
    (payment.status as PaymentStatus) === PaymentStatus.PENDING &&
    payment.expiresAt !== null &&
    payment.expiresAt.getTime() <= now.getTime()
  );
}

@Injectable()
export class PaymentExpirationService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly rewards: RewardsService,
    private readonly notifications: NotificationService,
    private readonly inventory: InventoryService,
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

  async reconcileCheckout(
    manager: EntityManager,
    customerId: string,
    orderId: string,
    now = new Date(),
  ): Promise<boolean> {
    const order = await manager.getRepository(OrderEntity).findOne({
      where: { id: orderId, customerId },
      lock: { mode: 'pessimistic_write' },
    });
    if (!order) {
      await this.releaseCart(manager, customerId, orderId, now);
      return false;
    }
    const payment = await manager.getRepository(PaymentEntity).findOne({
      where: { id: order.paymentId },
      lock: { mode: 'pessimistic_write' },
    });
    if (!payment) {
      await this.releaseCart(manager, customerId, orderId, now);
      return false;
    }
    if (isCheckoutPaymentActive(payment, now)) return true;
    if (
      payment.provider === MANUAL_PAYMENT_PROVIDER_NAME &&
      (payment.status as PaymentStatus) === PaymentStatus.PENDING
    ) {
      // A confirmed cash-on-delivery order: the checkout finished
      // successfully, it just never reaches PaymentCompletionService (no
      // webhook completes a manual payment). Convert the cart the same way
      // a paid order does on completion, instead of merely releasing the
      // lock - this also self-heals any cart that got stuck ACTIVE +
      // locked before this reconciliation existed, since every GET /cart
      // routes through here.
      await this.convertCart(manager, customerId, orderId, now);
    } else if (shouldExpirePayment(payment, now)) {
      await this.expireLocked(manager, payment, now, order);
    } else {
      await this.releaseCart(manager, customerId, orderId, now);
    }
    return false;
  }

  private async expireLocked(
    manager: EntityManager,
    payment: PaymentEntity,
    now: Date,
    existingOrder?: OrderEntity,
  ): Promise<boolean> {
    if (!shouldExpirePayment(payment, now)) return false;
    const order =
      existingOrder ||
      (await manager.getRepository(OrderEntity).findOne({
        where: { paymentId: payment.id },
        lock: { mode: 'pessimistic_write' },
      }));
    if (!order) return false;

    payment.status = PaymentStatus.CANCELLED;
    payment.cancellationReason = PAYMENT_EXPIRATION_REASON;
    order.status = OrderStatus.CANCELLED;
    order.fulfillmentStatus = 'cancelled';
    order.cancelledAt = now;

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
      await this.inventory.change(manager, {
        productId: item.productId,
        variantId: item.variantId,
        delta: item.quantity,
        type: InventoryMovementType.ORDER_RESTORE,
        orderId: order.id,
        reason: 'Pending payment expired',
        referenceKey: `order_restore:${order.id}:${item.id}`,
      });
    }

    await manager.getRepository(PaymentEntity).save(payment);
    await manager.getRepository(OrderEntity).save(order);
    await this.releaseCart(manager, order.customerId, order.id, now);
    await this.notifications.queue(
      manager,
      'order_cancelled',
      `payment_expired:${payment.id}`,
      order,
      { reason: 'payment_expired' },
    );
    return true;
  }

  private async releaseCart(
    manager: EntityManager,
    customerId: string,
    orderId: string,
    now: Date,
  ) {
    const cart = await manager.getRepository(CartEntity).findOne({
      where: {
        customerId,
        status: CartStatus.ACTIVE,
        checkoutOrderId: orderId,
      },
      lock: { mode: 'pessimistic_write' },
    });
    if (!cart) return;
    cart.checkoutOrderId = null;
    cart.lastActivityAt = now;
    await manager.getRepository(CartEntity).save(cart);
  }

  private async convertCart(
    manager: EntityManager,
    customerId: string,
    orderId: string,
    now: Date,
  ) {
    const cart = await manager.getRepository(CartEntity).findOne({
      where: {
        customerId,
        status: CartStatus.ACTIVE,
        checkoutOrderId: orderId,
      },
      lock: { mode: 'pessimistic_write' },
    });
    if (!cart) return;
    cart.status = CartStatus.CONVERTED;
    cart.convertedOrderId = orderId;
    cart.checkoutOrderId = null;
    cart.lastActivityAt = now;
    await manager.getRepository(CartEntity).save(cart);
  }
}
