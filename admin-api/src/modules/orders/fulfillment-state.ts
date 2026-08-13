import { PaymentStatus } from '../../utils/enums/PaymentEnums';
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
) {
  if (from === to) return 'duplicate';
  if (!next[from]?.includes(to))
    throw new Error(`Invalid fulfillment transition: ${from} -> ${to}`);
  if (
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
