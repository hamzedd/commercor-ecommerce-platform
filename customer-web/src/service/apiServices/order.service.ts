import {
  CreateOrderRequestType,
  OrderType,
  CheckoutQuoteType,
} from "@/src/utils/types/order.type";
import api from "@/src/service/apis/api";

export async function createOrderService(
  data: CreateOrderRequestType,
): Promise<{ paymentUrl: string; paymentId: string }> {
  return api.post("/orders", data).then((res) => res.data);
}

export async function getCheckoutQuoteService(
  data: CreateOrderRequestType,
): Promise<CheckoutQuoteType> {
  return api.post("/orders/quote", data).then((res) => res.data);
}

export async function getOrdersService(): Promise<OrderType[]> {
  return api.get("/orders").then((res) => res.data);
}

export async function downloadInvoiceService(id: string): Promise<Blob> {
  return api
    .get(`/invoices/${id}/pdf`, { responseType: "blob" })
    .then((res) => res.data);
}
