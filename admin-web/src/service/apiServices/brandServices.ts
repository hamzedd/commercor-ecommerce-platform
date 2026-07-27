import adminApi from "../apiInstances/adminApi.ts";
import type { BrandType } from "../../utils/types/brandTypes.ts";
import type { HttpStatusCode } from "axios";
import formDataAppender from "../../utils/functions/formDataAppender.ts";

export async function getBrandsService(): Promise<BrandType[]> {
  return adminApi.get("/brands").then((response) => response.data);
}

export async function getBrandService(id: string): Promise<BrandType> {
  return adminApi.get(`/brands/${id}`).then((response) => response.data);
}

export async function createBrandsService(
  data: BrandType,
): Promise<HttpStatusCode> {
  const formData = new FormData();
  formDataAppender({
    formData,
    values: data,
  });
  return adminApi
    .post(`/brands`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => response.data);
}

export async function updateBrandService(
  id: string,
  data: Partial<BrandType>,
): Promise<HttpStatusCode> {
  const formData = new FormData();
  formDataAppender({
    formData,
    values: data,
  });
  return adminApi
    .put(`/brands/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => response.data);
}

export async function deleteBrandsService(id: string): Promise<HttpStatusCode> {
  const { data: res } = await adminApi.delete(`/brands/${id}`);
  return res;
}
