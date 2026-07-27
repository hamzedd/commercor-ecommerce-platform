import adminApi from "../apiInstances/adminApi.ts";
import type {CustomerType} from "../../utils/types/customerTypes.ts";
import type { HttpStatusCode } from "axios";

export async function getCustomersService (): Promise<CustomerType[]> {
  return adminApi.get('/customers').then(
    response => response.data
  );
}

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
