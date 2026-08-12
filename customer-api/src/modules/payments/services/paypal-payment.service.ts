import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { PaymentStatus } from '@/src/utils/enums/PaymentEnums';
import { PayPalPaymentProvider } from '../providers/paypal.provider';
import { PaymentCompletionService } from '../payment-completion.service';

@Injectable()
export class PayPalPaymentService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly paypal: PayPalPaymentProvider,
    private readonly completion: PaymentCompletionService,
  ) {}

  async capture(paymentId: string, customerId: string, paypalOrderId: string) {
    const payment = await this.dataSource.transaction(async (manager) => {
      const current = await manager.getRepository(PaymentEntity).findOne({
        where: { id: paymentId }, lock: { mode: 'pessimistic_write' },
      });
      if (!current) throw new BadRequestException('Payment does not exist');
      const order = await manager.getRepository(OrderEntity).findOneBy({ paymentId, customerId });
      if (!order) throw new BadRequestException('Payment does not exist');
      if (current.provider !== 'paypal' || current.providerPaymentId !== paypalOrderId) {
        throw new BadRequestException('PayPal order reference does not match this payment');
      }
      if (![PaymentStatus.PENDING, PaymentStatus.COMPLETED].includes(current.status as PaymentStatus)) {
        throw new BadRequestException('Payment cannot be captured in its current state');
      }
      return current;
    });

    const event = payment.status === PaymentStatus.COMPLETED
      ? await this.paypal.retrieveOrder(paypalOrderId)
      : await this.paypal.captureOrder(paypalOrderId, `payment:${paymentId}:capture`);
    if (event.paymentId !== paymentId) throw new BadRequestException('PayPal payment reference mismatch');
    return this.completion.completeVerified({ ...event, provider: 'paypal' });
  }
}
