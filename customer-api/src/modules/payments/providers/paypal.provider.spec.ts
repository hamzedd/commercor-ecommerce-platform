import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PayPalPaymentProvider } from './paypal.provider';
import { NormalizedPaymentEventType } from './payment-provider';

describe('PayPalPaymentProvider', () => {
  const response = (body: unknown, ok = true, status = 200) =>
    ({ ok, status, json: async () => body }) as Response;

  beforeEach(() => jest.restoreAllMocks());

  it('obtains and caches OAuth then creates a server-priced order idempotently', async () => {
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(response({ access_token: 'token', expires_in: 3600 }))
      .mockResolvedValueOnce(response({ id: 'PAYPAL-ORDER', links: [{ rel: 'approve', href: 'https://sandbox.paypal.test' }] }))
      .mockResolvedValueOnce(response({ id: 'PAYPAL-ORDER-2' }));
    const provider = new PayPalPaymentProvider();
    const input = { paymentId: 'payment', orderId: 'order', customerId: 'customer', amount: 12.34, currencyCode: 'EUR', returnUrl: 'http://localhost/status', idempotencyKey: 'payment:payment:initialize' };
    const result = await provider.createPayment(input);
    await provider.createPayment({ ...input, idempotencyKey: 'second' });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    const create = fetchMock.mock.calls[1];
    expect((create[1]?.headers as Record<string, string>)['PayPal-Request-Id']).toBe(input.idempotencyKey);
    expect(JSON.parse(String(create[1]?.body))).toEqual(expect.objectContaining({
      intent: 'CAPTURE', purchase_units: [expect.objectContaining({ custom_id: 'payment', amount: { value: '12.34', currency_code: 'EUR' } })],
    }));
    expect(result).toEqual(expect.objectContaining({ provider: 'paypal', providerPaymentId: 'PAYPAL-ORDER', currencyCode: 'EUR' }));
    expect(JSON.stringify(result)).not.toContain('secret');
    expect(JSON.stringify(result)).not.toContain('token');
  });

  it('normalizes only a completed capture', async () => {
    jest.spyOn(global, 'fetch')
      .mockResolvedValueOnce(response({ access_token: 'token', expires_in: 3600 }))
      .mockResolvedValueOnce(response({ id: 'ORDER', status: 'COMPLETED', purchase_units: [{ custom_id: 'payment', payments: { captures: [{ id: 'CAPTURE', status: 'COMPLETED', amount: { value: '20.00', currency_code: 'USD' } }] } }] }));
    await expect(new PayPalPaymentProvider().captureOrder('ORDER', 'key')).resolves.toEqual({
      type: NormalizedPaymentEventType.PAYMENT_COMPLETED, paymentId: 'payment', externalTransactionId: 'CAPTURE', amount: 20, currencyCode: 'USD',
    });
  });

  it('rejects a non-completed capture', async () => {
    jest.spyOn(global, 'fetch')
      .mockResolvedValueOnce(response({ access_token: 'token', expires_in: 3600 }))
      .mockResolvedValueOnce(response({ id: 'ORDER', status: 'APPROVED', purchase_units: [] }));
    await expect(new PayPalPaymentProvider().captureOrder('ORDER', 'key')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects an invalid webhook and accepts a verified one', async () => {
    const event = { id: 'event', event_type: 'PAYMENT.CAPTURE.COMPLETED', resource: { id: 'CAPTURE', custom_id: 'payment', amount: { value: '10.00', currency_code: 'USD' } } };
    const headers = { 'paypal-auth-algo': 'SHA256withRSA', 'paypal-cert-url': 'https://paypal.test/cert', 'paypal-transmission-id': 'id', 'paypal-transmission-sig': 'sig', 'paypal-transmission-time': '2026-08-12T00:00:00Z' };
    jest.spyOn(global, 'fetch')
      .mockResolvedValueOnce(response({ access_token: 'token', expires_in: 3600 }))
      .mockResolvedValueOnce(response({ verification_status: 'FAILURE' }));
    const invalidProvider = new PayPalPaymentProvider();
    jest.spyOn(invalidProvider as any, 'webhookId').mockReturnValue('webhook');
    await expect(invalidProvider.verifyWebhook({ headers, rawBody: Buffer.from(JSON.stringify(event)) })).rejects.toBeInstanceOf(UnauthorizedException);

    jest.restoreAllMocks();
    jest.spyOn(global, 'fetch')
      .mockResolvedValueOnce(response({ access_token: 'token', expires_in: 3600 }))
      .mockResolvedValueOnce(response({ verification_status: 'SUCCESS' }));
    const provider = new PayPalPaymentProvider();
    jest.spyOn(provider as any, 'webhookId').mockReturnValue('webhook');
    const verified = await provider.verifyWebhook({ headers, rawBody: Buffer.from(JSON.stringify(event)) });
    expect(provider.parseVerifiedEvent(verified)).toEqual(expect.objectContaining({ paymentId: 'payment', externalTransactionId: 'CAPTURE' }));
  });

  it('normalizes only confirmed provider refunds', async () => {
    jest.spyOn(global, 'fetch')
      .mockResolvedValueOnce(response({ access_token: 'token', expires_in: 3600 }))
      .mockResolvedValueOnce(response({ id: 'REFUND', status: 'COMPLETED' }));
    await expect(new PayPalPaymentProvider().refundPayment({ paymentId: 'payment', externalTransactionId: 'CAPTURE', amount: 5, currencyCode: 'USD', idempotencyKey: 'refund-key' })).resolves.toEqual({ provider: 'paypal', providerRefundId: 'REFUND', pending: false });
  });
});
