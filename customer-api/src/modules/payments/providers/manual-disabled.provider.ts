import { Injectable, ServiceUnavailableException } from '@nestjs/common';
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

@Injectable()
export class ManualDisabledPaymentProvider implements PaymentProvider {
  readonly name = 'manual_disabled';

  private unavailable(): never {
    throw new ServiceUnavailableException(
      'Payment provider is unavailable. Configure a verified payment provider to accept payments.',
    );
  }

  async createPayment(
    _request: CreateProviderPaymentRequest,
  ): Promise<CreateProviderPaymentResult> {
    return this.unavailable();
  }

  async verifyWebhook(
    _request: VerifyWebhookRequest,
  ): Promise<VerifiedWebhook> {
    return this.unavailable();
  }

  parseVerifiedEvent(_webhook: VerifiedWebhook): NormalizedPaymentEvent {
    return this.unavailable();
  }

  async refundPayment(
    _request: RefundProviderPaymentRequest,
  ): Promise<RefundProviderPaymentResult> {
    return this.unavailable();
  }
}
