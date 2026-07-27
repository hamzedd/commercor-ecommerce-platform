import adminApi from "../apiInstances/adminApi.ts";
import type { ProductFilterOptionType } from "../../utils/types/productFilterOptionTypes.ts";
import type { HttpStatusCode } from "axios";

export async function addProductFilterOptionService(
  data: ProductFilterOptionType,
): Promise<HttpStatusCode> {
  return adminApi
    .post(`/products/filters/options`, data)
    .then((response) => response.data);
}

export async function getProductFilterOptionsService(
  id: string,
): Promise<ProductFilterOptionType[]> {
  return adminApi
    .get(`/products/filters/${id}/options`)
    .then((response) => response.data);
}

export async function editProductFilterOptionService(
  id: string,
  data: ProductFilterOptionType,
): Promise<HttpStatusCode> {
  return adminApi
    .put(`/products/filters/options/${id}`, data)
    .then((response) => response.data);
}

export async function deleteProductFilterOptionService(
  id: string,
): Promise<HttpStatusCode> {
  return adminApi
    .delete(`/products/filters/options/${id}`)
    .then((response) => response.data);
}
