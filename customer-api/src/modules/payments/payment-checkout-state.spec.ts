import { PaymentStatus } from '@/src/utils/enums/PaymentEnums';
import { isCheckoutPaymentActive } from './payment-checkout-state';
import { MANUAL_PAYMENT_PROVIDER_NAME } from './providers/manual.provider';

describe('checkout payment state', () => {
  const now = new Date('2026-08-21T10:00:00Z');

  it('only locks a cart for a non-expired pending payment', () => {
    expect(
      isCheckoutPaymentActive(
        {
          status: PaymentStatus.PENDING,
          expiresAt: new Date(now.getTime() + 1),
        },
        now,
      ),
    ).toBe(true);
    expect(
      isCheckoutPaymentActive(
        {
          status: PaymentStatus.PENDING,
          expiresAt: new Date(now.getTime() - 1),
        },
        now,
      ),
    ).toBe(false);
  });

  it.each([
    PaymentStatus.COMPLETED,
    PaymentStatus.FAILED,
    PaymentStatus.CANCELLED,
    PaymentStatus.PARTIALLY_REFUNDED,
    PaymentStatus.REFUNDED,
  ])('treats terminal status %s as inactive', (status) => {
    expect(isCheckoutPaymentActive({ status, expiresAt: null }, now)).toBe(
      false,
    );
  });

  it('never locks a checkout for a pending manual/COD payment, however long it stays pending', () => {
    // Cash-on-delivery payments are deliberately left PENDING forever
    // (staff confirm cash collection later) with no expiresAt - that is
    // "awaiting delivery", not "customer still checking out".
    expect(
      isCheckoutPaymentActive(
        {
          status: PaymentStatus.PENDING,
          expiresAt: null,
          provider: MANUAL_PAYMENT_PROVIDER_NAME,
        },
        now,
      ),
    ).toBe(false);
    expect(
      isCheckoutPaymentActive(
        {
          status: PaymentStatus.PENDING,
          expiresAt: null,
          provider: MANUAL_PAYMENT_PROVIDER_NAME,
        },
        new Date(now.getTime() + 365 * 24 * 60 * 60_000),
      ),
    ).toBe(false);
  });

  it('still locks a genuinely unfinished non-manual checkout regardless of provider field presence', () => {
    expect(
      isCheckoutPaymentActive(
        {
          status: PaymentStatus.PENDING,
          expiresAt: new Date(now.getTime() + 1),
          provider: 'paypal',
        },
        now,
      ),
    ).toBe(true);
    expect(
      isCheckoutPaymentActive(
        {
          status: PaymentStatus.PENDING,
          expiresAt: new Date(now.getTime() + 1),
          provider: null,
        },
        now,
      ),
    ).toBe(true);
  });
});
