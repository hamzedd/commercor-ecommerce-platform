import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { PaymentStatus } from '@/src/utils/enums/PaymentEnums';

export function isCheckoutPaymentActive(
  payment: Pick<PaymentEntity, 'status' | 'expiresAt'>,
  now = new Date(),
) {
  return (
    (payment.status as PaymentStatus) === PaymentStatus.PENDING &&
    (!payment.expiresAt || payment.expiresAt.getTime() > now.getTime())
  );
}
