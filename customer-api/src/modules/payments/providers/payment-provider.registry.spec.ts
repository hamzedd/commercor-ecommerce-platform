import { ServiceUnavailableException } from '@nestjs/common';
import { ManualDisabledPaymentProvider } from './manual-disabled.provider';
import { PaymentProviderRegistry } from './payment-provider.registry';

describe('PaymentProviderRegistry', () => {
  const manual = new ManualDisabledPaymentProvider();

  it('rejects unsupported providers clearly', () => {
    const registry = new PaymentProviderRegistry(manual, {
      name: 'paypal',
    } as any);
    expect(() => registry.get('unsupported')).toThrow(
      'Unsupported PAYMENT_PROVIDER',
    );
  });

  it('manual_disabled cannot initialize or complete a payment', async () => {
    await expect(
      manual.createPayment({
        paymentId: 'payment',
        orderId: 'order',
        customerId: 'customer',
        amount: 10,
        currencyCode: 'USD',
        returnUrl: 'http://localhost/status',
        idempotencyKey: 'payment:payment:initialize',
      }),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
    await expect(
      manual.verifyWebhook({ headers: {}, rawBody: Buffer.from('{}') }),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});
