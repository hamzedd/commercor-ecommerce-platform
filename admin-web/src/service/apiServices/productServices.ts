import adminApi from "../apiInstances/adminApi.ts";
import type { ProductType } from "../../utils/types/productTypes.ts";
import type { CreateProductType } from "../../utils/types/productTypes.ts";
import type { HttpStatusCode } from "axios";
import type { ProductFilterValueType } from "../../utils/types/productFilterValueTypes.ts";
import formDataAppender from "../../utils/functions/formDataAppender.ts";

export async function getProductsService(): Promise<ProductType[]> {
  return adminApi.get("/products").then((response) => response.data);
}

export async function createProductsService(
  data: CreateProductType,
): Promise<HttpStatusCode> {
  const formData = new FormData();
  formDataAppender({ values: data, formData });
  return adminApi
    .post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => response.data);
}

export async function getProductService(id: string): Promise<ProductType> {
  return adminApi.get(`/products/${id}`).then((response) => response.data);
}

export async function updateProductService(
  id: string,
  data: Partial<ProductType>,
): Promise<HttpStatusCode> {
  const formData = new FormData();
  formDataAppender({ values: data, formData });
  return adminApi
    .put(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => response.data);
}

export async function deleteProductsService(id: string) {
  return adminApi.delete(`/products/${id}`).then((response) => response.data);
}

export async function getProductFilterValuesService(
  productId: string,
): Promise<ProductFilterValueType[]> {
  return adminApi
    .get(`/products/${productId}/filter-values`)
    .then((response) => response.data);
}

export async function assignProductFilterValueService(data: {
  productFilterId: string;
  productFilterOptionId: string;
  productId: string;
}): Promise<ProductFilterValueType> {
  return adminApi
    .put(`/products/filter-values`, data)
    .then((response) => response.data);
}

export async function deleteProductFilterValueService(
  valueId: string,
): Promise<HttpStatusCode> {
  return adminApi
    .delete(`/products/filter-values/${valueId}`)
    .then((response) => response.data);
}
