export enum NormalizedPaymentEventType {
  PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_CANCELLED = 'PAYMENT_CANCELLED',
  REFUND_COMPLETED = 'REFUND_COMPLETED',
}

export type CreateProviderPaymentRequest = {
  paymentId: string;
  orderId: string;
  customerId: string;
  amount: number;
  currencyCode: string;
  returnUrl: string;
  idempotencyKey: string;
};

export type CreateProviderPaymentResult = {
  provider: string;
  publicClientId?: string;
  redirectUrl?: string;
  clientToken?: string;
  providerPaymentId: string;
  currencyCode: string;
};

export type VerifyWebhookRequest = {
  headers: Readonly<Record<string, string | string[] | undefined>>;
  rawBody: Buffer;
};

export type VerifiedWebhook = { provider: string; payload: unknown };

export type NormalizedPaymentEvent = {
  type: NormalizedPaymentEventType;
  paymentId: string;
  externalTransactionId: string;
  amount: number;
  currencyCode: string;
  refundAmount?: number;
  relatedTransactionId?: string;
};

export type RefundProviderPaymentRequest = {
  paymentId: string;
  externalTransactionId: string;
  amount: number;
  currencyCode: string;
  idempotencyKey: string;
};

export type RefundProviderPaymentResult = {
  provider: string;
  providerRefundId: string;
  pending: boolean;
};

export interface PaymentProvider {
  readonly name: string;
  createPayment(
    request: CreateProviderPaymentRequest,
  ): Promise<CreateProviderPaymentResult>;
  verifyWebhook(request: VerifyWebhookRequest): Promise<VerifiedWebhook>;
  parseVerifiedEvent(webhook: VerifiedWebhook): NormalizedPaymentEvent;
  refundPayment(
    request: RefundProviderPaymentRequest,
  ): Promise<RefundProviderPaymentResult>;
}
