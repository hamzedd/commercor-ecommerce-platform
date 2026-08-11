import api from "@/src/service/apis/api";
import { GetPaymentStatusResponseType } from "@/src/utils/types/payment.type";

export async function checkPaymentStatusService(
  id: string,
): Promise<GetPaymentStatusResponseType> {
  return api.get(`/payments/${id}/status`).then((res) => res.data);
}
