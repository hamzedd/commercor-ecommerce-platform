import { PaymentStatus } from '@/src/utils/enums/PaymentEnums';
import { isCheckoutPaymentActive } from './payment-checkout-state';

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
});
