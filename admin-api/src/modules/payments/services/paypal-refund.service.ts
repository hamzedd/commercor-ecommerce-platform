import { BadGatewayException, Injectable } from '@nestjs/common';
import {
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  PAYPAL_ENV,
} from '@/src/utils/environmentConstants';

@Injectable()
export class PayPalRefundService {
  private token?: { value: string; expiresAt: number };
  private readonly baseUrl =
    PAYPAL_ENV === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

  private async accessToken() {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new BadGatewayException('PayPal refund credentials are not configured');
    }
    if (this.token && this.token.expiresAt > Date.now() + 30_000) return this.token.value;
    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    const body: any = await response.json().catch(() => ({}));
    if (!response.ok) throw new BadGatewayException('PayPal authentication failed');
    this.token = {
      value: body.access_token,
      expiresAt: Date.now() + Number(body.expires_in || 300) * 1000,
    };
    return this.token.value;
  }

  async refund(captureId: string, amount: number, currencyCode: string, requestId: string) {
    const token = await this.accessToken();
    const response = await fetch(
      `${this.baseUrl}/v2/payments/captures/${encodeURIComponent(captureId)}/refund`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'PayPal-Request-Id': requestId,
        },
        body: JSON.stringify({
          amount: { value: amount.toFixed(2), currency_code: currencyCode },
        }),
      },
    );
    const body: any = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new BadGatewayException(
        `PayPal refund failed (${response.status}): ${body.message || body.name || 'unknown error'}`,
      );
    }
    if (body.status !== 'COMPLETED') {
      throw new BadGatewayException('PayPal refund has not completed');
    }
    if (!body.id || Number(body.amount?.value) !== Number(amount.toFixed(2)) || body.amount?.currency_code !== currencyCode) {
      throw new BadGatewayException('PayPal refund response did not match the request');
    }
    return { externalRefundId: body.id, amount: Number(body.amount.value) };
  }
}
