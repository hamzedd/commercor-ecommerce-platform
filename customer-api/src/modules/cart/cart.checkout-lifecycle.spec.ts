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
      (service as any).assertMutable({} as never, cart()),
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

    await (service as any).assertMutable({} as never, unlocked);
    await (service as any).assertMutable({} as never, unlocked);
    expect(expiration.reconcileCheckout).not.toHaveBeenCalled();
  });
});
