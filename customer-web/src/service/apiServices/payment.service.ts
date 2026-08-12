import api from "@/src/service/apis/api";
import { GetPaymentStatusResponseType } from "@/src/utils/types/payment.type";

export async function checkPaymentStatusService(
  id: string,
): Promise<GetPaymentStatusResponseType> {
  return api.get(`/payments/${id}/status`).then((response) => response.data);
}

export type PaymentInitialization = {
  provider: string;
  providerPaymentId: string;
  publicClientId?: string;
  redirectUrl?: string;
  currencyCode: string;
};

export function initializePaymentService(paymentId: string) {
  return api
    .post<PaymentInitialization>(`/payments/${paymentId}/initialize`)
    .then((response) => response.data);
}

export function capturePayPalService(paymentId: string, paypalOrderId: string) {
  return api
    .post(`/payments/${paymentId}/paypal/capture`, { paypalOrderId })
    .then((response) => response.data);
}
