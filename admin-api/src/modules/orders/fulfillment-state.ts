import { PaymentStatus } from '../../utils/enums/PaymentEnums';
import { MANUAL_PAYMENT_PROVIDER_NAME } from '../../utils/constants/PaymentProviders';
export enum FulfillmentStatus { PENDING='pending',PROCESSING='processing',SHIPPED='shipped',DELIVERED='delivered',CANCELLED='cancelled',REFUNDED='refunded' }
const next: Record<FulfillmentStatus, FulfillmentStatus[]> = {
  [FulfillmentStatus.PENDING]: [
    FulfillmentStatus.PROCESSING,
    FulfillmentStatus.CANCELLED,
  ],
  [FulfillmentStatus.PROCESSING]: [
    FulfillmentStatus.SHIPPED,
    FulfillmentStatus.CANCELLED,
  ],
  [FulfillmentStatus.SHIPPED]: [FulfillmentStatus.DELIVERED],
  [FulfillmentStatus.DELIVERED]: [],
  [FulfillmentStatus.CANCELLED]: [],
  [FulfillmentStatus.REFUNDED]: [],
};
export function assertFulfillmentTransition(
  from: FulfillmentStatus,
  to: FulfillmentStatus,
  paymentStatus: string,
  paymentProvider?: string | null,
) {
  if (from === to) return 'duplicate';
  if (!next[from]?.includes(to))
    throw new Error(`Invalid fulfillment transition: ${from} -> ${to}`);
  // Cash-on-delivery orders collect payment at delivery, not at checkout -
  // their payment is deliberately left PENDING through the whole
  // fulfillment lifecycle (see customer-api's manual payment provider), so
  // the "must be paid" gate below does not apply to them. Every other
  // payment rule (refunded orders cannot be fulfilled) still applies.
  const isCashOnDelivery = paymentProvider === MANUAL_PAYMENT_PROVIDER_NAME;
  if (
    !isCashOnDelivery &&
    [
      FulfillmentStatus.PROCESSING,
      FulfillmentStatus.SHIPPED,
      FulfillmentStatus.DELIVERED,
    ].includes(to) &&
    ![PaymentStatus.COMPLETED, PaymentStatus.PARTIALLY_REFUNDED].includes(
      paymentStatus as PaymentStatus,
    )
  )
    throw new Error('Order must be paid before fulfillment');
  if (paymentStatus === PaymentStatus.REFUNDED)
    throw new Error('Refunded order cannot be fulfilled');
  return 'transition';
}
export function validNextFulfillmentStatuses(from: FulfillmentStatus) {
  return next[from] || [];
}
