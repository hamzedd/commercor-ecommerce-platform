import { assertFulfillmentTransition, FulfillmentStatus as F } from './fulfillment-state';
import { PaymentStatus as P } from '../../utils/enums/PaymentEnums';
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
});
