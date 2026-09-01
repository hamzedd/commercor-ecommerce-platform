import { BadRequestException } from '@nestjs/common';
import { PaymentInitializationService } from './payment-initialization.service';
import { PaymentStatus } from '@/src/utils/enums/PaymentEnums';

describe('PaymentInitializationService', () => {
  const provider = {
    createPayment: jest.fn(async (input) => ({
      ...input,
      provider: 'paypal',
      providerPaymentId: 'paypal-order',
    })),
  };
  const providers = { getConfiguredProvider: () => provider };
  const carts = { convert: jest.fn(async () => undefined) };

  function service(payment: any, order: any) {
    const manager = {
      getRepository: jest.fn((entity) => ({
        findOne: jest.fn(async () =>
          entity.name === 'PaymentEntity' ? payment : order,
        ),
        save: jest.fn(async (value) => value),
      })),
    };
    const dataSource = {
      transaction: jest.fn(async (work) => work(manager)),
    };
    return new PaymentInitializationService(
      dataSource as any,
      providers as any,
      carts as any,
    );
  }

  beforeEach(() => {
    provider.createPayment.mockClear();
    carts.convert.mockClear();
  });

  it('does not initialize another customer payment', async () => {
    const target = service(
      {
        id: 'payment',
        status: PaymentStatus.PENDING,
        expiresAt: new Date(Date.now() + 60_000),
        totalAmount: 42,
        currencyCode: 'USD',
      },
      null,
    );
    await expect(
      target.initialize('payment', 'attacker'),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(provider.createPayment).not.toHaveBeenCalled();
  });

  it('uses the persisted order amount and stable idempotency key', async () => {
    const target = service(
      {
        id: 'payment',
        status: PaymentStatus.PENDING,
        expiresAt: new Date(Date.now() + 60_000),
        totalAmount: 42,
        currencyCode: 'usd',
      },
      { id: 'order', finalTotal: 42 },
    );
    await target.initialize('payment', 'customer');
    expect(provider.createPayment).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 42,
        currencyCode: 'USD',
        idempotencyKey: 'payment:payment:initialize',
      }),
    );
  });

  it('converts and unlocks the cart when the configured provider is manual (cash on delivery)', async () => {
    provider.createPayment.mockImplementationOnce(async (input) => ({
      ...input,
      provider: 'manual',
      providerPaymentId: input.paymentId,
    }));
    const target = service(
      {
        id: 'payment',
        status: PaymentStatus.PENDING,
        expiresAt: null,
        totalAmount: 42,
        currencyCode: 'USD',
      },
      { id: 'order', finalTotal: 42 },
    );
    await target.initialize('payment', 'customer');
    expect(carts.convert).toHaveBeenCalledWith(
      expect.anything(),
      'customer',
      'order',
    );
  });

  it('does not convert the cart for non-manual providers', async () => {
    const target = service(
      {
        id: 'payment',
        status: PaymentStatus.PENDING,
        expiresAt: new Date(Date.now() + 60_000),
        totalAmount: 42,
        currencyCode: 'USD',
      },
      { id: 'order', finalTotal: 42 },
    );
    await target.initialize('payment', 'customer');
    expect(carts.convert).not.toHaveBeenCalled();
  });
});
