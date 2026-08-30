import { Injectable, BadRequestException } from '@nestjs/common';
import {
  CreateProviderPaymentRequest,
  CreateProviderPaymentResult,
  NormalizedPaymentEvent,
  PaymentProvider,
  RefundProviderPaymentRequest,
  RefundProviderPaymentResult,
  VerifiedWebhook,
  VerifyWebhookRequest,
} from './payment-provider';

export const MANUAL_PAYMENT_PROVIDER_NAME = 'manual';

/**
 * Cash on delivery / pay-manually fallback. Unlike ManualDisabledPaymentProvider
 * this does NOT block checkout - it lets an order and its payment record be
 * created normally, without contacting any external gateway. The payment is
 * left pending/unpaid (never auto-completed here); staff mark it paid through
 * the existing admin order/payment flow once payment is actually collected.
 */
@Injectable()
export class ManualPaymentProvider implements PaymentProvider {
  readonly name = MANUAL_PAYMENT_PROVIDER_NAME;

  createPayment(
    request: CreateProviderPaymentRequest,
  ): Promise<CreateProviderPaymentResult> {
    // No external gateway, no redirect: the caller identifies this
    // provider's payments deterministically by their own paymentId.
    return Promise.resolve({
      provider: this.name,
      providerPaymentId: request.paymentId,
      currencyCode: request.currencyCode,
    });
  }

  verifyWebhook(_request: VerifyWebhookRequest): Promise<VerifiedWebhook> {
    throw new BadRequestException(
      'The manual payment provider has no webhooks to verify.',
    );
  }

  parseVerifiedEvent(_webhook: VerifiedWebhook): NormalizedPaymentEvent {
    throw new BadRequestException(
      'The manual payment provider has no webhook events to parse.',
    );
  }

  refundPayment(
    _request: RefundProviderPaymentRequest,
  ): Promise<RefundProviderPaymentResult> {
    throw new BadRequestException(
      'Manual/cash-on-delivery payments are refunded through the admin order flow, not the payment provider.',
    );
  }
}
