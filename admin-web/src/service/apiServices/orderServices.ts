import adminApi from "../apiInstances/adminApi.ts";
import type {OrderType} from "../../utils/types/orderTypes.ts";
import type {HttpStatusCode} from "axios";

export async function getOrdersService (): Promise<OrderType[]> {
  return adminApi.get('/orders').then(
    response => response.data
  );
}
export const updateFulfillment=(id:string,data:{fulfillmentStatus:string;carrier?:string;trackingNumber?:string;trackingUrl?:string;note?:string}):Promise<OrderType>=>adminApi.put(`/orders/${id}/fulfillment`,data).then(r=>r.data);

export async function getOrderService(id: string): Promise<OrderType> {
  return adminApi.get(`/orders/${id}`).then((response) => response.data);
}

export async function updateOrderService(
  id: string,
  data: Partial<OrderType>
  ): Promise<HttpStatusCode> {
  return adminApi
  .put(`/orders/${id}`, data)
  .then((response) => response.data);
}


