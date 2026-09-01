import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { PaymentStatus } from '@/src/utils/enums/PaymentEnums';
import { MANUAL_PAYMENT_PROVIDER_NAME } from './providers/manual.provider';

export function isCheckoutPaymentActive(
  payment: Pick<PaymentEntity, 'status' | 'expiresAt'> &
    Partial<Pick<PaymentEntity, 'provider'>>,
  now = new Date(),
) {
  if (
    (payment.status as PaymentStatus) === PaymentStatus.PENDING &&
    payment.provider === MANUAL_PAYMENT_PROVIDER_NAME
  ) {
    // A manual/cash-on-delivery payment is deliberately left PENDING
    // forever - staff confirm cash collection later, it is never
    // auto-completed. Once the provider has resolved to "manual" the order
    // has already been placed and confirmed; PENDING from here on means
    // "awaiting delivery/cash collection", not "customer still checking
    // out". Treating it as an active lock is exactly the bug that left
    // COD carts stuck.
    return false;
  }
  return (
    (payment.status as PaymentStatus) === PaymentStatus.PENDING &&
    (!payment.expiresAt || payment.expiresAt.getTime() > now.getTime())
  );
}
