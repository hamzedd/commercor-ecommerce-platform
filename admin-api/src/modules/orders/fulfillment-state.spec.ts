import { assertFulfillmentTransition, FulfillmentStatus as F } from './fulfillment-state';
import { PaymentStatus as P } from '../../utils/enums/PaymentEnums';
import { MANUAL_PAYMENT_PROVIDER_NAME } from '../../utils/constants/PaymentProviders';
describe('fulfillment state', () => {
  it('rejects unpaid processing', () =>
    expect(() =>
      assertFulfillmentTransition(F.PENDING, F.PROCESSING, P.PENDING),
    ).toThrow('paid'));
  it('allows paid lifecycle', () => {
    expect(
      assertFulfillmentTransition(F.PENDING, F.PROCESSING, P.COMPLETED),
    ).toBe('transition');
    expect(
      assertFulfillmentTransition(F.PROCESSING, F.SHIPPED, P.COMPLETED),
    ).toBe('transition');
    expect(
      assertFulfillmentTransition(F.SHIPPED, F.DELIVERED, P.COMPLETED),
    ).toBe('transition');
  });
  it('rejects backward and terminal transitions', () => {
    expect(() =>
      assertFulfillmentTransition(F.SHIPPED, F.PENDING, P.COMPLETED),
    ).toThrow();
    expect(() =>
      assertFulfillmentTransition(F.CANCELLED, F.SHIPPED, P.COMPLETED),
    ).toThrow();
    expect(() =>
      assertFulfillmentTransition(F.REFUNDED, F.DELIVERED, P.REFUNDED),
    ).toThrow();
  });
  it('handles duplicate safely', () =>
    expect(assertFulfillmentTransition(F.SHIPPED, F.SHIPPED, P.COMPLETED)).toBe(
      'duplicate',
    ));

  describe('cash-on-delivery exception', () => {
    it('lets a COD order with a pending payment confirm/process/ship', () => {
      expect(
        assertFulfillmentTransition(
          F.PENDING,
          F.PROCESSING,
          P.PENDING,
          MANUAL_PAYMENT_PROVIDER_NAME,
        ),
      ).toBe('transition');
      expect(
        assertFulfillmentTransition(
          F.PROCESSING,
          F.SHIPPED,
          P.PENDING,
          MANUAL_PAYMENT_PROVIDER_NAME,
        ),
      ).toBe('transition');
    });

    it('lets a COD order with a pending payment be marked delivered', () => {
      expect(
        assertFulfillmentTransition(
          F.SHIPPED,
          F.DELIVERED,
          P.PENDING,
          MANUAL_PAYMENT_PROVIDER_NAME,
        ),
      ).toBe('transition');
    });

    it('still blocks fulfillment for a pending non-manual (gateway) payment', () => {
      expect(() =>
        assertFulfillmentTransition(F.PENDING, F.PROCESSING, P.PENDING, 'paypal'),
      ).toThrow('paid');
      expect(() =>
        assertFulfillmentTransition(F.PENDING, F.PROCESSING, P.PENDING, null),
      ).toThrow('paid');
    });

    it('still blocks a refunded COD order regardless of provider', () => {
      expect(() =>
        assertFulfillmentTransition(
          F.SHIPPED,
          F.DELIVERED,
          P.REFUNDED,
          MANUAL_PAYMENT_PROVIDER_NAME,
        ),
      ).toThrow('Refunded');
    });
  });
});
