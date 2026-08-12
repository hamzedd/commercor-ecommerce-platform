import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  PAYPAL_ENV,
  PAYPAL_WEBHOOK_ID,
} from '@/src/utils/environmentConstants';
import {
  CreateProviderPaymentRequest,
  CreateProviderPaymentResult,
  NormalizedPaymentEvent,
  NormalizedPaymentEventType,
  PaymentProvider,
  RefundProviderPaymentRequest,
  RefundProviderPaymentResult,
  VerifiedWebhook,
  VerifyWebhookRequest,
} from './payment-provider';

type PayPalAmount = { currency_code: string; value: string };
type PayPalCapture = { id: string; status: string; amount: PayPalAmount; custom_id?: string };
type PayPalOrder = {
  id: string;
  status: string;
  purchase_units?: Array<{
    custom_id?: string;
    amount?: PayPalAmount;
    payments?: { captures?: PayPalCapture[] };
  }>;
  links?: Array<{ rel: string; href: string }>;
};
type PayPalWebhookEvent = {
  id: string;
  event_type: string;
  resource: Record<string, any>;
};

@Injectable()
export class PayPalPaymentProvider implements PaymentProvider {
  readonly name = 'paypal';
  private token?: { value: string; expiresAt: number };
  private readonly baseUrl =
    PAYPAL_ENV === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

  protected webhookId() { return PAYPAL_WEBHOOK_ID; }

  private async accessToken() {
    if (this.token && this.token.expiresAt > Date.now() + 30_000) return this.token.value;
    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    const body = await this.read(response);
    this.token = {
      value: String(body.access_token),
      expiresAt: Date.now() + Number(body.expires_in || 300) * 1000,
    };
    return this.token.value;
  }

  private async read(response: Response): Promise<any> {
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new BadGatewayException(
        `PayPal request failed (${response.status}): ${body.message || body.name || 'unknown error'}`,
      );
    }
    return body;
  }

  private async request(path: string, init: RequestInit = {}) {
    const token = await this.accessToken();
    return this.read(
      await fetch(`${this.baseUrl}${path}`, {
        ...init,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...(init.headers || {}),
        },
      }),
    );
  }

  async createPayment(request: CreateProviderPaymentRequest): Promise<CreateProviderPaymentResult> {
    const order: PayPalOrder = await this.request('/v2/checkout/orders', {
      method: 'POST',
      headers: { 'PayPal-Request-Id': request.idempotencyKey },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: request.orderId,
          custom_id: request.paymentId,
          invoice_id: request.paymentId,
          amount: {
            currency_code: request.currencyCode,
            value: request.amount.toFixed(2),
          },
        }],
        application_context: {
          return_url: request.returnUrl,
          cancel_url: request.returnUrl,
          user_action: 'PAY_NOW',
        },
      }),
    });
    if (!order.id) throw new BadGatewayException('PayPal did not return an order ID');
    return {
      provider: this.name,
      providerPaymentId: order.id,
      redirectUrl: order.links?.find((link) => link.rel === 'approve')?.href,
      publicClientId: PAYPAL_CLIENT_ID,
      currencyCode: request.currencyCode,
    };
  }

  async captureOrder(orderId: string, idempotencyKey: string): Promise<NormalizedPaymentEvent> {
    const order: PayPalOrder = await this.request(
      `/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
      { method: 'POST', headers: { 'PayPal-Request-Id': idempotencyKey }, body: '{}' },
    );
    return this.normalizeCompletedOrder(order);
  }

  async retrieveOrder(orderId: string): Promise<NormalizedPaymentEvent> {
    const order: PayPalOrder = await this.request(
      `/v2/checkout/orders/${encodeURIComponent(orderId)}`,
    );
    return this.normalizeCompletedOrder(order);
  }

  private normalizeCompletedOrder(order: PayPalOrder): NormalizedPaymentEvent {
    const unit = order.purchase_units?.[0];
    const capture = unit?.payments?.captures?.find((item) => item.status === 'COMPLETED');
    if (order.status !== 'COMPLETED' || !capture) {
      throw new BadRequestException('PayPal payment capture is not completed');
    }
    if (!unit?.custom_id) throw new BadRequestException('PayPal payment reference is missing');
    return {
      type: NormalizedPaymentEventType.PAYMENT_COMPLETED,
      paymentId: unit.custom_id,
      externalTransactionId: capture.id,
      amount: Number(capture.amount.value),
      currencyCode: capture.amount.currency_code,
    };
  }

  async verifyWebhook(request: VerifyWebhookRequest): Promise<VerifiedWebhook> {
    const webhookId = this.webhookId();
    if (!webhookId) throw new UnauthorizedException('PayPal webhook is not configured');
    const header = (name: string) => {
      const value = request.headers[name] ?? request.headers[name.toLowerCase()];
      return Array.isArray(value) ? value[0] : value;
    };
    let event: PayPalWebhookEvent;
    try { event = JSON.parse(request.rawBody.toString('utf8')); }
    catch { throw new BadRequestException('Invalid PayPal webhook JSON'); }
    const result = await this.request('/v1/notifications/verify-webhook-signature', {
      method: 'POST',
      body: JSON.stringify({
        auth_algo: header('paypal-auth-algo'),
        cert_url: header('paypal-cert-url'),
        transmission_id: header('paypal-transmission-id'),
        transmission_sig: header('paypal-transmission-sig'),
        transmission_time: header('paypal-transmission-time'),
        webhook_id: webhookId,
        webhook_event: event,
      }),
    });
    if (result.verification_status !== 'SUCCESS') {
      throw new UnauthorizedException('Invalid PayPal webhook signature');
    }
    return { provider: this.name, payload: event };
  }

  parseVerifiedEvent(webhook: VerifiedWebhook): NormalizedPaymentEvent {
    if (webhook.provider !== this.name) throw new UnauthorizedException('Webhook provider mismatch');
    const event = webhook.payload as PayPalWebhookEvent;
    const resource = event.resource;
    const paymentId = String(resource.custom_id || resource.invoice_id || '');
    const amount = resource.amount || resource.seller_payable_breakdown?.gross_amount;
    const map: Record<string, NormalizedPaymentEventType> = {
      'PAYMENT.CAPTURE.COMPLETED': NormalizedPaymentEventType.PAYMENT_COMPLETED,
      'PAYMENT.CAPTURE.DENIED': NormalizedPaymentEventType.PAYMENT_FAILED,
      'PAYMENT.CAPTURE.REFUNDED': NormalizedPaymentEventType.REFUND_COMPLETED,
    };
    const type = map[event.event_type];
    if (!type) throw new BadRequestException('Unsupported PayPal webhook event');
    if (
      (type !== NormalizedPaymentEventType.REFUND_COMPLETED && !paymentId) ||
      !resource.id || !amount?.value || !amount?.currency_code
    ) {
      throw new BadRequestException('PayPal webhook is missing payment details');
    }
    return {
      type,
      paymentId,
      externalTransactionId: String(resource.id),
      amount: Number(amount.value),
      currencyCode: String(amount.currency_code),
      refundAmount: type === NormalizedPaymentEventType.REFUND_COMPLETED ? Number(amount.value) : undefined,
      relatedTransactionId:
        type === NormalizedPaymentEventType.REFUND_COMPLETED
          ? String(resource.links?.find((link: any) => link.rel === 'up')?.href || '').split('/').pop()
          : undefined,
    };
  }

  async refundPayment(request: RefundProviderPaymentRequest): Promise<RefundProviderPaymentResult> {
    const refund = await this.request(
      `/v2/payments/captures/${encodeURIComponent(request.externalTransactionId)}/refund`,
      {
        method: 'POST',
        headers: { 'PayPal-Request-Id': request.idempotencyKey },
        body: JSON.stringify({ amount: { value: request.amount.toFixed(2), currency_code: request.currencyCode } }),
      },
    );
    if (!['COMPLETED', 'PENDING'].includes(refund.status)) {
      throw new BadGatewayException('PayPal did not accept the refund');
    }
    return { provider: this.name, providerRefundId: refund.id, pending: refund.status !== 'COMPLETED' };
  }
}
