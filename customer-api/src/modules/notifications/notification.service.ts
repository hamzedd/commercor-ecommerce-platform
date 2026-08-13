import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import {
  NotificationOutboxEntity,
  OutboxStatus,
} from '@/src/libs/models/entities/notification/NotificationOutbox.entity';
import { CustomerEntity } from '@/src/libs/models/entities/customer/Customer.entity';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { DOMAIN_URL } from '@/src/utils/environmentConstants';
@Injectable()
export class NotificationService {
  async queueCustomer(
    manager: EntityManager,
    customer: CustomerEntity,
    type: string,
    dedupe: string,
    payload: Record<string, unknown>,
  ) {
    const repo = manager.getRepository(NotificationOutboxEntity);
    if (await repo.existsBy({ deduplicationKey: dedupe })) return;
    await repo.save(
      repo.create({
        type,
        deduplicationKey: dedupe,
        customerId: customer.id,
        orderId: null,
        recipientEmail: customer.email,
        subject: this.subject(type),
        payload: { customerName: customer.firstName, ...payload },
        status: OutboxStatus.PENDING,
        attempts: 0,
        lastError: null,
        nextAttemptAt: null,
        sentAt: null,
      }),
    );
  }
  async queue(
    manager: EntityManager,
    type: string,
    dedupe: string,
    order: OrderEntity,
    payload: Record<string, unknown> = {},
  ) {
    const customer = await manager
      .getRepository(CustomerEntity)
      .findOneBy({ id: order.customerId });
    if (!customer) return;
    const repo = manager.getRepository(NotificationOutboxEntity);
    if (await repo.existsBy({ deduplicationKey: dedupe })) return;
    await repo.save(
      repo.create({
        type,
        deduplicationKey: dedupe,
        customerId: customer.id,
        orderId: order.id,
        recipientEmail: customer.email,
        subject: this.subject(type),
        payload: {
          customerName: customer.firstName,
          orderReference: order.id,
          orderUrl: DOMAIN_URL
            ? `${DOMAIN_URL.replace(/\/$/, '')}/profile`
            : undefined,
          ...payload,
        },
        status: OutboxStatus.PENDING,
        attempts: 0,
        lastError: null,
        nextAttemptAt: null,
        sentAt: null,
      }),
    );
  }
  private subject(t: string) {
    return (
      (
        {
          order_created: 'Order received',
          payment_completed: 'Payment completed',
          payment_failed: 'Payment update',
          order_processing: 'Order processing',
          order_shipped: 'Order shipped',
          order_delivered: 'Order delivered',
          refund_completed: 'Refund completed',
          order_cancelled: 'Order cancelled',
          password_reset: 'Reset your password',
          abandoned_cart: 'Your cart is waiting',
        } as Record<string, string>
      )[t] || 'Order update'
    );
  }
}
