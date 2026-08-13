import {
  PaymentExpirationService,
  PAYMENT_EXPIRATION_REASON,
  pendingPaymentExpiresAt,
  shouldExpirePayment,
} from './payment-expiration.service';
import { OrderStatus, PaymentStatus } from '@/src/utils/enums/PaymentEnums';

describe('PaymentExpirationService', () => {
  const now = new Date('2026-08-12T10:00:00Z');

  it('assigns a deadline to new pending payments', () => {
    expect(pendingPaymentExpiresAt(now.getTime()).getTime()).toBeGreaterThan(
      now.getTime(),
    );
  });

  it('only considers pending payments whose deadline has passed', () => {
    expect(
      shouldExpirePayment(
        {
          status: PaymentStatus.PENDING,
          expiresAt: new Date(now.getTime() - 1),
        },
        now,
      ),
    ).toBe(true);
    expect(
      shouldExpirePayment(
        {
          status: PaymentStatus.PENDING,
          expiresAt: new Date(now.getTime() + 1),
        },
        now,
      ),
    ).toBe(false);
    for (const status of [
      PaymentStatus.COMPLETED,
      PaymentStatus.FAILED,
      PaymentStatus.CANCELLED,
    ]) {
      expect(
        shouldExpirePayment(
          { status, expiresAt: new Date(now.getTime() - 1) },
          now,
        ),
      ).toBe(false);
    }
  });

  it('cancels once and restores stock and rewards once', async () => {
    const payment: any = {
      id: 'payment',
      status: PaymentStatus.PENDING,
      expiresAt: new Date(now.getTime() - 1),
      cancellationReason: null,
    };
    const order: any = {
      id: 'order',
      paymentId: payment.id,
      customerId: 'customer',
      status: OrderStatus.PENDING,
      pointsRedeemed: 100,
      cashbackUsed: 5,
    };
    const product: any = { id: 'product', stock: 3 };
    const query = {
      setLock: jest.fn(),
      setOnLocked: jest.fn(),
      where: jest.fn(),
      andWhere: jest.fn(),
      orderBy: jest.fn(),
      take: jest.fn(),
      getMany: jest.fn(async () =>
        payment.status === PaymentStatus.PENDING ? [payment] : [],
      ),
    } as any;
    for (const method of [
      'setLock',
      'setOnLocked',
      'where',
      'andWhere',
      'orderBy',
      'take',
    ]) {
      query[method].mockReturnValue(query);
    }
    const paymentRepo = { createQueryBuilder: () => query, save: jest.fn() };
    const orderRepo = { findOne: jest.fn(async () => order), save: jest.fn() };
    const itemRepo = {
      findBy: jest.fn(async () => [
        { orderId: order.id, productId: product.id, quantity: 2 },
      ]),
    };
    const productRepo = {
      findOne: jest.fn(async () => product),
      save: jest.fn(),
    };
    const manager = {
      getRepository: jest.fn((entity) => {
        if (entity.name === 'PaymentEntity') return paymentRepo;
        if (entity.name === 'OrderEntity') return orderRepo;
        if (entity.name === 'OrderItemEntity') return itemRepo;
        return productRepo;
      }),
    };
    const dataSource = {
      transaction: jest.fn(async (work) => work(manager)),
    };
    const rewards = { restoreRedemption: jest.fn() };
    const service = new PaymentExpirationService(
      dataSource as any,
      rewards as any,
      { queue: jest.fn() } as any,
    );

    await expect(service.expirePendingPayments(now)).resolves.toBe(1);
    await expect(service.expirePendingPayments(now)).resolves.toBe(0);
    expect(payment.status).toBe(PaymentStatus.CANCELLED);
    expect(payment.cancellationReason).toBe(PAYMENT_EXPIRATION_REASON);
    expect(order.status).toBe(OrderStatus.CANCELLED);
    expect(product.stock).toBe(5);
    expect(rewards.restoreRedemption).toHaveBeenCalledTimes(1);
    expect(productRepo.save).toHaveBeenCalledTimes(1);
  });
});
