import adminApi from "../apiInstances/adminApi.ts";
import type {
  ProductFilterType,
  ProductFilterTypeType,
  ProductFilterWithOptionsType,
} from "../../utils/types/productFilterTypes.ts";
import type { HttpStatusCode } from "axios";

export async function getProductFilterTypesService(): Promise<
  ProductFilterTypeType[]
> {
  return adminApi
    .get("/products/filters/types")
    .then((response) => response.data);
}

export async function getProductFiltersService(): Promise<ProductFilterType[]> {
  return adminApi.get("/products/filters").then((response) => response.data);
}

export async function getProductFilterService(
  id: string,
): Promise<ProductFilterType> {
  return adminApi
    .get(`/products/filters/${id}`)
    .then((response) => response.data);
}

export async function updateProductFilterService(
  id: string,
  data: Partial<ProductFilterType>,
): Promise<HttpStatusCode> {
  return adminApi
    .put(`/products/filters/${id}`, data)
    .then((response) => response.data);
}

export async function createProductFiltersService(
  data: ProductFilterType,
): Promise<HttpStatusCode> {
  return adminApi
    .post("/products/filters", data)
    .then((response) => response.data);
}

export async function deleteProductFiltersService(id: string) {
  return adminApi
    .delete(`/products/filters/${id}`)
    .then((response) => response.data);
}

export async function getProductFiltersWithOptionsService(
  categoryId?: string,
): Promise<ProductFilterWithOptionsType[]> {
  return adminApi
    .get("/products/filters/with-options", {
      params: categoryId ? { categoryId } : undefined,
    })
    .then((response) => response.data);
}
