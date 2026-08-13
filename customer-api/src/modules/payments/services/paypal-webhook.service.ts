import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentCompletionService } from '../payment-completion.service';
import { PayPalPaymentProvider } from '../providers/paypal.provider';
import {
  NormalizedPaymentEventType,
  VerifyWebhookRequest,
} from '../providers/payment-provider';
import { PaymentStatus } from '@/src/utils/enums/PaymentEnums';
import { DataSource } from 'typeorm';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { VerifiedRefundService } from './verified-refund.service';

@Injectable()
export class PayPalWebhookService {
  constructor(
    private readonly paypal: PayPalPaymentProvider,
    private readonly completion: PaymentCompletionService,
    private readonly dataSource: DataSource,
    private readonly refunds: VerifiedRefundService,
  ) {}

  async process(request: VerifyWebhookRequest) {
    const verified = await this.paypal.verifyWebhook(request);
    const event = this.paypal.parseVerifiedEvent(verified);
    if (event.type === NormalizedPaymentEventType.PAYMENT_COMPLETED) {
      return this.completion.completeVerified({ ...event, provider: 'paypal' });
    }
    if (event.type === NormalizedPaymentEventType.PAYMENT_FAILED) {
      return this.completion.failVerified({
        paymentId: event.paymentId,
        provider: 'paypal',
        externalTransactionId: event.externalTransactionId,
        status: PaymentStatus.FAILED,
      });
    }
    if (event.type === NormalizedPaymentEventType.REFUND_COMPLETED) {
      if (!event.relatedTransactionId || !event.refundAmount)
        throw new BadRequestException('PayPal refund reference is missing');
      const payment = await this.dataSource
        .getRepository(PaymentEntity)
        .findOneBy({ externalTransactionId: event.relatedTransactionId });
      if (!payment)
        throw new BadRequestException(
          'Refund capture does not match a payment',
        );
      return this.refunds.record(
        payment.id,
        event.externalTransactionId,
        event.refundAmount,
      );
    }
    throw new BadRequestException('Unsupported PayPal webhook event');
  }
}
