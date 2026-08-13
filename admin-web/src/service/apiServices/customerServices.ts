import adminApi from "../apiInstances/adminApi.ts";
import type {CustomerType,CrmCustomer,CrmDetail,CustomerTag,CrmNote} from "../../utils/types/customerTypes.ts";
import type { HttpStatusCode } from "axios";

export async function getCustomersService (params?:Record<string,unknown>): Promise<{data:CrmCustomer[];page:number;limit:number;total:number}> {
  return adminApi.get('/customers',{params}).then(
    response => response.data
  );
}
export const getCrmCustomer=(id:string):Promise<CrmDetail>=>adminApi.get(`/customers/${id}`).then(r=>r.data);export const updateCrmStatus=(id:string,status:string)=>adminApi.put(`/customers/${id}/crm`,{status}).then(r=>r.data);export const getCustomerTimeline=(id:string)=>adminApi.get(`/customers/${id}/timeline`).then(r=>r.data);export const listCustomerTags=():Promise<CustomerTag[]>=>adminApi.get('/customer-tags').then(r=>r.data);export const createCustomerTag=(name:string):Promise<CustomerTag>=>adminApi.post('/customer-tags',{name}).then(r=>r.data);export const assignCustomerTag=(customerId:string,tagId:string)=>adminApi.post(`/customers/${customerId}/tags/${tagId}`).then(r=>r.data);export const removeCustomerTag=(customerId:string,tagId:string)=>adminApi.delete(`/customers/${customerId}/tags/${tagId}`).then(r=>r.data);export const createCrmNote=(id:string,note:string):Promise<CrmNote>=>adminApi.post(`/customers/${id}/notes`,{note}).then(r=>r.data);export const updateCrmNote=(id:string,noteId:string,note:string)=>adminApi.put(`/customers/${id}/notes/${noteId}`,{note}).then(r=>r.data);export const deleteCrmNote=(id:string,noteId:string)=>adminApi.delete(`/customers/${id}/notes/${noteId}`).then(r=>r.data);

export async function getCustomerService(id: string): Promise<CustomerType> {
  return adminApi.get(`/customers/${id}`).then((response) => response.data);
}

export async function updateCustomerService(
  id: string,
  data: Partial<CustomerType>
): Promise<HttpStatusCode> {
  return adminApi
    .put(`/customers/${id}`, data)
    .then((response) => response.data);
}

export async function createCustomerService(
  data: CustomerType,
): Promise<HttpStatusCode> {
  return adminApi.post("/customers", data).then((response) => response.data);
}


export async function deleteCustomersService (id: string) {
  return adminApi.delete(`/customers/${id}`).then(
    response => response.data
  );
}
