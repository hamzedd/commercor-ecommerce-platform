import adminApi from "../apiInstances/adminApi.ts";
import type { PaymentType } from "../../utils/types/paymentTypes.ts";

export async function getPaymentsService(): Promise<PaymentType[]> {
  return adminApi.get("/payments").then((response) => response.data);
}

export async function getPaymentService(id: string): Promise<PaymentType> {
  return adminApi.get(`/payments/${id}`).then((response) => response.data);
}
