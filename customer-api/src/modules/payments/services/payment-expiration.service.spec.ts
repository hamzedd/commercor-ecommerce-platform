/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/require-await */

import {
  PaymentExpirationService,
  PAYMENT_EXPIRATION_REASON,
  pendingPaymentExpiresAt,
  shouldExpirePayment,
} from './payment-expiration.service';
import { OrderStatus, PaymentStatus } from '@/src/utils/enums/PaymentEnums';
import { MANUAL_PAYMENT_PROVIDER_NAME } from '../providers/manual.provider';
import { CartStatus } from '@/src/libs/models/entities/cart/Cart.entity';

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
    const cart: any = {
      customerId: order.customerId,
      checkoutOrderId: order.id,
      status: 'active',
      lastActivityAt: new Date(now.getTime() - 60_000),
    };
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
    const cartRepo = {
      findOne: jest.fn(async () =>
        cart.checkoutOrderId === order.id ? cart : null,
      ),
      save: jest.fn(),
    };
    const manager = {
      getRepository: jest.fn((entity) => {
        if (entity.name === 'PaymentEntity') return paymentRepo;
        if (entity.name === 'OrderEntity') return orderRepo;
        if (entity.name === 'OrderItemEntity') return itemRepo;
        if (entity.name === 'CartEntity') return cartRepo;
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
      {
        change: jest.fn(async (_manager, input) => {
          product.stock += input.delta;
          return true;
        }),
      } as any,
    );

    await expect(service.expirePendingPayments(now)).resolves.toBe(1);
    await expect(service.expirePendingPayments(now)).resolves.toBe(0);
    expect(payment.status).toBe(PaymentStatus.CANCELLED);
    expect(payment.cancellationReason).toBe(PAYMENT_EXPIRATION_REASON);
    expect(order.status).toBe(OrderStatus.CANCELLED);
    expect(cart.checkoutOrderId).toBeNull();
    expect(cartRepo.save).toHaveBeenCalledTimes(1);
    expect(product.stock).toBe(5);
    expect(rewards.restoreRedemption).toHaveBeenCalledTimes(1);
    expect(productRepo.save).not.toHaveBeenCalled();
  });

  function reconcileService() {
    return new PaymentExpirationService(
      { transaction: jest.fn() } as any,
      { restoreRedemption: jest.fn() } as any,
      { queue: jest.fn() } as any,
      { change: jest.fn() } as any,
    );
  }

  it('self-heals a legacy stuck COD cart: reconcileCheckout() converts and unlocks it', async () => {
    const order: any = {
      id: 'order',
      paymentId: 'payment',
      customerId: 'customer',
    };
    const payment: any = {
      id: 'payment',
      status: PaymentStatus.PENDING,
      provider: MANUAL_PAYMENT_PROVIDER_NAME,
      expiresAt: null,
    };
    // A cart stuck exactly as production described it: still ACTIVE, still
    // locked to the order, from before this reconciliation existed.
    const legacyCart: any = {
      id: 'legacy-cart',
      customerId: order.customerId,
      status: CartStatus.ACTIVE,
      checkoutOrderId: order.id,
      convertedOrderId: null,
      lastActivityAt: new Date(now.getTime() - 3_600_000),
    };
    const orderRepo = { findOne: jest.fn(async () => order) };
    const paymentRepo = { findOne: jest.fn(async () => payment) };
    const cartRepo = {
      findOne: jest.fn(async () =>
        legacyCart.status === CartStatus.ACTIVE &&
        legacyCart.checkoutOrderId === order.id
          ? legacyCart
          : null,
      ),
      save: jest.fn(async (value: any) => Object.assign(legacyCart, value)),
    };
    const manager = {
      getRepository: jest.fn((entity) => {
        if (entity.name === 'OrderEntity') return orderRepo;
        if (entity.name === 'PaymentEntity') return paymentRepo;
        return cartRepo;
      }),
    } as any;
    const service = reconcileService();

    await expect(
      service.reconcileCheckout(manager, order.customerId, order.id, now),
    ).resolves.toBe(false);

    expect(legacyCart.status).toBe(CartStatus.CONVERTED);
    expect(legacyCart.convertedOrderId).toBe(order.id);
    expect(legacyCart.checkoutOrderId).toBeNull();
    expect(cartRepo.save).toHaveBeenCalledTimes(1);

    // A fresh GET /cart-style lookup no longer finds this cart as ACTIVE -
    // CartService.active() would create a genuinely new, empty one.
    expect(await cartRepo.findOne()).toBeNull();
  });

  it('does not convert a cancelled/failed manual payment - it releases the cart instead', async () => {
    const order: any = { id: 'order', paymentId: 'payment', customerId: 'c' };
    const payment: any = {
      id: 'payment',
      status: PaymentStatus.CANCELLED,
      provider: MANUAL_PAYMENT_PROVIDER_NAME,
      expiresAt: null,
    };
    const cart: any = {
      id: 'cart',
      customerId: order.customerId,
      status: CartStatus.ACTIVE,
      checkoutOrderId: order.id,
    };
    const orderRepo = { findOne: jest.fn(async () => order) };
    const paymentRepo = { findOne: jest.fn(async () => payment) };
    const cartRepo = {
      findOne: jest.fn(async () => cart),
      save: jest.fn(async (value: any) => Object.assign(cart, value)),
    };
    const manager = {
      getRepository: jest.fn((entity) => {
        if (entity.name === 'OrderEntity') return orderRepo;
        if (entity.name === 'PaymentEntity') return paymentRepo;
        return cartRepo;
      }),
    } as any;
    const service = reconcileService();

    await expect(
      service.reconcileCheckout(manager, order.customerId, order.id, now),
    ).resolves.toBe(false);

    // Cancelled/failed orders return the items to the (still active) cart
    // for reorder rather than converting it away.
    expect(cart.status).toBe(CartStatus.ACTIVE);
    expect(cart.checkoutOrderId).toBeNull();
  });

  it('leaves a genuinely unfinished non-manual (gateway) checkout locked', async () => {
    const order: any = { id: 'order', paymentId: 'payment', customerId: 'c' };
    const payment: any = {
      id: 'payment',
      status: PaymentStatus.PENDING,
      provider: 'paypal',
      expiresAt: new Date(now.getTime() + 60_000),
    };
    const orderRepo = { findOne: jest.fn(async () => order) };
    const paymentRepo = { findOne: jest.fn(async () => payment) };
    const cartRepo = { findOne: jest.fn(), save: jest.fn() };
    const manager = {
      getRepository: jest.fn((entity) => {
        if (entity.name === 'OrderEntity') return orderRepo;
        if (entity.name === 'PaymentEntity') return paymentRepo;
        return cartRepo;
      }),
    } as any;
    const service = reconcileService();

    await expect(
      service.reconcileCheckout(manager, order.customerId, order.id, now),
    ).resolves.toBe(true);
    expect(cartRepo.save).not.toHaveBeenCalled();
  });
});
