import { BadRequestException } from '@nestjs/common';
import { PaymentInitializationService } from './payment-initialization.service';
import { PaymentStatus } from '@/src/utils/enums/PaymentEnums';

describe('PaymentInitializationService', () => {
  const provider = { createPayment: jest.fn(async (input) => input) };
  const providers = { getConfiguredProvider: () => provider };

  function service(payment: any, order: any) {
    const manager = {
      getRepository: jest.fn((entity) => ({
        findOne: jest.fn(async () =>
          entity.name === 'PaymentEntity' ? payment : order,
        ),
      })),
    };
    const dataSource = {
      transaction: jest.fn(async (work) => work(manager)),
    };
    return new PaymentInitializationService(
      dataSource as any,
      providers as any,
    );
  }

  beforeEach(() => provider.createPayment.mockClear());

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
});
