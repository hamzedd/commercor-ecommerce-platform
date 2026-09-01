import { FulfillmentService } from './fulfillment.service';
import { FulfillmentStatus } from '@/src/libs/models/entities/order/OrderStatusHistory.entity';
import { OrderStatus, PaymentStatus } from '@/src/utils/enums/PaymentEnums';
import { MANUAL_PAYMENT_PROVIDER_NAME } from '@/src/utils/constants/PaymentProviders';

describe('FulfillmentService.transition - order completion timing', () => {
  function service(order: any, payment: any) {
    const orderRepo = {
      findOne: jest.fn(async () => order),
      save: jest.fn(async (value: any) => Object.assign(order, value)),
    };
    const paymentRepo = { findOneBy: jest.fn(async () => payment) };
    const historyRepo = {
      create: jest.fn((value: any) => value),
      save: jest.fn(async () => undefined),
    };
    // No customer -> the notification-outbox branch is skipped, so it
    // doesn't need its own mock chain.
    const customerRepo = { findOneBy: jest.fn(async () => null) };
    const manager = {
      getRepository: jest.fn((entity) => {
        if (entity.name === 'OrderEntity') return orderRepo;
        if (entity.name === 'PaymentEntity') return paymentRepo;
        if (entity.name === 'OrderStatusHistoryEntity') return historyRepo;
        if (entity.name === 'CustomerEntity') return customerRepo;
        return {};
      }),
    };
    const db = { transaction: jest.fn(async (work: any) => work(manager)) };
    return new FulfillmentService(db as any);
  }

  it('payment received first, delivered later: completes the order once DELIVERED is reached', async () => {
    const order: any = {
      id: 'order',
      paymentId: 'payment',
      customerId: 'customer',
      status: OrderStatus.PENDING,
      fulfillmentStatus: FulfillmentStatus.SHIPPED,
    };
    const payment: any = {
      id: 'payment',
      // Already collected via markManualPaymentPaid() before delivery.
      status: PaymentStatus.COMPLETED,
      provider: MANUAL_PAYMENT_PROVIDER_NAME,
    };
    const target = service(order, payment);

    await target.transition('order', 'admin', {
      fulfillmentStatus: FulfillmentStatus.DELIVERED,
    } as any);

    expect(order.fulfillmentStatus).toBe(FulfillmentStatus.DELIVERED);
    expect(order.status).toBe(OrderStatus.COMPLETED);
  });

  it('does not complete the order on delivery while COD payment is still pending', async () => {
    const order: any = {
      id: 'order',
      paymentId: 'payment',
      customerId: 'customer',
      status: OrderStatus.PENDING,
      fulfillmentStatus: FulfillmentStatus.SHIPPED,
    };
    const payment: any = {
      id: 'payment',
      status: PaymentStatus.PENDING,
      provider: MANUAL_PAYMENT_PROVIDER_NAME,
    };
    const target = service(order, payment);

    await target.transition('order', 'admin', {
      fulfillmentStatus: FulfillmentStatus.DELIVERED,
    } as any);

    expect(order.fulfillmentStatus).toBe(FulfillmentStatus.DELIVERED);
    expect(order.status).toBe(OrderStatus.PENDING);
  });
});
