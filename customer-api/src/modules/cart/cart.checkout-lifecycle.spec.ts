/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */

import { BadRequestException } from '@nestjs/common';
import { CartStatus } from '@/src/libs/models/entities/cart/Cart.entity';
import { CartService } from './cart.service';

describe('CartService checkout lifecycle', () => {
  const cart = () => ({
    id: 'cart',
    customerId: 'customer',
    status: CartStatus.ACTIVE,
    checkoutOrderId: 'order',
    lastActivityAt: new Date(),
  });

  it('blocks mutation while the checkout payment is active', async () => {
    const expiration = { reconcileCheckout: jest.fn().mockResolvedValue(true) };
    const service = new CartService({} as never, expiration as never);

    await expect(
      (service as any).assertMutable({} as never, 'customer', cart()),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('unlocks a stale terminal checkout and permits add', async () => {
    const staleCart = cart();
    const expiration = {
      reconcileCheckout: jest.fn().mockResolvedValue(false),
    };
    const itemRepo = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn((value) => value),
      save: jest.fn((value) => Promise.resolve(value)),
    };
    const manager = { getRepository: jest.fn(() => itemRepo) };
    const db = { transaction: jest.fn((work) => work(manager)) };
    const service = new CartService(db as never, expiration as never);
    jest.spyOn(service as any, 'validate').mockResolvedValue({ stock: 10 });
    jest.spyOn(service as any, 'active').mockResolvedValue(staleCart);
    jest.spyOn(service as any, 'touch').mockResolvedValue(undefined);
    jest.spyOn(service as any, 'readWith').mockResolvedValue({ items: [] });

    await expect(
      service.add('customer', {
        productId: 'product',
        variantId: null,
        quantity: 1,
      }),
    ).resolves.toEqual({ items: [] });
    expect(staleCart.checkoutOrderId).toBeNull();
    expect(itemRepo.save).toHaveBeenCalledTimes(1);
  });

  it('does nothing for a cart without a checkout and remains idempotent', async () => {
    const expiration = { reconcileCheckout: jest.fn() };
    const service = new CartService({} as never, expiration as never);
    const unlocked = { ...cart(), checkoutOrderId: null };

    await (service as any).assertMutable({} as never, 'customer', unlocked);
    await (service as any).assertMutable({} as never, 'customer', unlocked);
    expect(expiration.reconcileCheckout).not.toHaveBeenCalled();
  });

  it('self-heals a legacy COD-locked cart: add() converts the stuck cart in-place and operates on the fresh one', async () => {
    // Reproduces the exact production shape: cart still ACTIVE, still
    // linked to the order, from before COD reconciliation self-healed it.
    const staleCart = cart();
    const freshCart = {
      id: 'fresh-cart',
      customerId: 'customer',
      status: CartStatus.ACTIVE,
      checkoutOrderId: null,
      lastActivityAt: new Date(),
    };
    const expiration = {
      // Simulates the fixed isCheckoutPaymentActive()/reconcileCheckout():
      // a confirmed COD payment is no longer an active checkout lock, and
      // the cart backing it has just been converted in the database.
      reconcileCheckout: jest.fn().mockResolvedValue(false),
    };
    const itemRepo = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn((value) => value),
      save: jest.fn((value) => Promise.resolve(value)),
    };
    const manager = { getRepository: jest.fn(() => itemRepo) };
    const db = { transaction: jest.fn((work) => work(manager)) };
    const service = new CartService(db as never, expiration as never);
    jest.spyOn(service as any, 'validate').mockResolvedValue({ stock: 10 });
    const activeSpy = jest
      .spyOn(service as any, 'active')
      .mockResolvedValueOnce(staleCart) // add()'s initial cart lookup
      .mockResolvedValueOnce(freshCart); // assertMutable's re-resolve after conversion
    jest.spyOn(service as any, 'touch').mockResolvedValue(undefined);
    jest.spyOn(service as any, 'readWith').mockResolvedValue({ items: [] });

    await expect(
      service.add('customer', {
        productId: 'product',
        variantId: null,
        quantity: 1,
      }),
    ).resolves.toEqual({ items: [] });

    expect(activeSpy).toHaveBeenCalledTimes(2);
    // The new item must land on the fresh cart, never on the now-historical
    // (converted) stale one - otherwise it would silently vanish, since
    // GET /cart only ever looks up the customer's ACTIVE cart.
    expect(itemRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ cartId: 'fresh-cart' }),
    );
  });

  it('convert() releases the checkout lock (cash-on-delivery order confirmation), and a repeat call is a safe no-op', async () => {
    const converted = cart();
    const cartRepo = {
      findOne: jest.fn(async () =>
        converted.status === CartStatus.ACTIVE ? converted : null,
      ),
      save: jest.fn(async (value) => Object.assign(converted, value)),
    };
    const manager = { getRepository: jest.fn(() => cartRepo) };
    const expiration = { reconcileCheckout: jest.fn() };
    const service = new CartService({} as never, expiration as never);

    await service.convert(manager as never, 'customer', 'order');
    expect(converted.status).toBe(CartStatus.CONVERTED);
    expect(converted.checkoutOrderId).toBeNull();

    // A second convert() call for the same order (e.g. a duplicate payment
    // initialization retry) must not throw or mutate anything further -
    // the cart is no longer ACTIVE so the lookup finds nothing.
    await service.convert(manager as never, 'customer', 'order');
    expect(cartRepo.save).toHaveBeenCalledTimes(1);

    // Once converted, a fresh mutation on a *new* active cart is never
    // blocked by the old checkout - there is no lingering lock to reconcile.
    const freshCart = { ...cart(), checkoutOrderId: null };
    await (service as any).assertMutable({} as never, 'customer', freshCart);
    expect(expiration.reconcileCheckout).not.toHaveBeenCalled();
  });
});
