import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import {
  FulfillmentStatus,
  OrderStatusHistoryEntity,
} from '@/src/libs/models/entities/order/OrderStatusHistory.entity';
import { FulfillmentDto } from '../dtos/Fulfillment.dto';
import {
  NotificationOutboxEntity,
  OutboxStatus,
} from '@/src/libs/models/entities/notification/NotificationOutbox.entity';
import { CustomerEntity } from '@/src/libs/models/entities/customer/Customer.entity';
import {
  assertFulfillmentTransition,
  validNextFulfillmentStatuses,
} from '../fulfillment-state';
@Injectable()
export class FulfillmentService {
  constructor(private db: DataSource) {}
  async transition(orderId: string, userId: string, d: FulfillmentDto) {
    return this.db.transaction(async (m) => {
      const order = await m.getRepository(OrderEntity).findOne({
        where: { id: orderId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!order) throw new NotFoundException('Order not found');
      const payment = await m
        .getRepository(PaymentEntity)
        .findOneBy({ id: order.paymentId });
      if (!payment) throw new BadRequestException('Order has no payment');
      const from = (order.fulfillmentStatus ||
        FulfillmentStatus.PENDING) as FulfillmentStatus;
      let action;
      try {
        action = assertFulfillmentTransition(
          from,
          d.fulfillmentStatus,
          payment.status,
        );
      } catch (e) {
        throw new BadRequestException((e as Error).message);
      }
      if (action === 'duplicate')
        return {
          ...order,
          idempotent: true,
          validNext: validNextFulfillmentStatuses(from),
        };
      const now = new Date();
      Object.assign(order, {
        fulfillmentStatus: d.fulfillmentStatus,
        carrier: d.carrier?.trim() || order.carrier || null,
        trackingNumber:
          d.trackingNumber?.trim() || order.trackingNumber || null,
        trackingUrl: d.trackingUrl?.trim() || order.trackingUrl || null,
      });
      if (d.fulfillmentStatus === FulfillmentStatus.PROCESSING)
        order.processingAt = now;
      if (d.fulfillmentStatus === FulfillmentStatus.SHIPPED)
        order.shippedAt = now;
      if (d.fulfillmentStatus === FulfillmentStatus.DELIVERED)
        order.deliveredAt = now;
      if (d.fulfillmentStatus === FulfillmentStatus.CANCELLED)
        order.cancelledAt = now;
      await m.getRepository(OrderEntity).save(order);
      await m.getRepository(OrderStatusHistoryEntity).save(
        m.getRepository(OrderStatusHistoryEntity).create({
          orderId,
          fromStatus: from,
          toStatus: d.fulfillmentStatus,
          changedByUserId: userId,
          note: d.note?.trim() || null,
        }),
      );
      const customer = await m
        .getRepository(CustomerEntity)
        .findOneBy({ id: order.customerId });
      const type = `order_${d.fulfillmentStatus}`;
      if (
        customer &&
        [
          'order_processing',
          'order_shipped',
          'order_delivered',
          'order_cancelled',
        ].includes(type)
      ) {
        const outbox = m.getRepository(NotificationOutboxEntity),
          deduplicationKey = `${type}:${order.id}`;
        await outbox
          .createQueryBuilder()
          .insert()
          .values(
            outbox.create({
              type,
              deduplicationKey,
              customerId: customer.id,
              orderId: order.id,
              recipientEmail: customer.email,
              subject:
                d.fulfillmentStatus === FulfillmentStatus.SHIPPED
                  ? 'Order shipped'
                  : d.fulfillmentStatus === FulfillmentStatus.DELIVERED
                  ? 'Order delivered'
                  : d.fulfillmentStatus === FulfillmentStatus.PROCESSING
                  ? 'Order processing'
                  : 'Order cancelled',
              payload: {
                customerName: customer.firstName,
                orderReference: order.id,
                carrier: order.carrier,
                trackingNumber: order.trackingNumber,
                trackingUrl: order.trackingUrl,
              },
              status: OutboxStatus.PENDING,
              attempts: 0,
              lastError: null,
              nextAttemptAt: null,
              sentAt: null,
            }),
          )
          .orIgnore()
          .execute();
      }
      return {
        ...order,
        idempotent: false,
        validNext: validNextFulfillmentStatuses(d.fulfillmentStatus),
      };
    });
  }
}
