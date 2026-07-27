import adminApi from "../apiInstances/adminApi.ts";
import type { PaymentType } from "../../utils/types/paymentTypes.ts";
import type { HttpStatusCode } from "axios";
import type { OrderType } from "../../utils/types/orderTypes.ts";

export async function getPaymentsService(): Promise<PaymentType[]> {
  return adminApi.get("/payments").then((response) => response.data);
}

export async function getPaymentService(id: string): Promise<PaymentType> {
  return adminApi.get(`/payments/${id}`).then((response) => response.data);
}

export async function updatePaymentService(
  id: string,
  data: Partial<OrderType>,
): Promise<HttpStatusCode> {
  return adminApi.put(`/brands/${id}`, data).then((response) => response.data);
}
