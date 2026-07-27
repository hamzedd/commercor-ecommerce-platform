import adminApi from "../apiInstances/adminApi.ts";
import type {
  CategoryType,
  CreateCategoryType,
} from "../../utils/types/categoryTypes.ts";
import type { HttpStatusCode } from "axios";
import formDataAppender from "../../utils/functions/formDataAppender.ts";

export async function getCategoriesService(): Promise<CategoryType[]> {
  return adminApi.get("/categories").then((response) => response.data);
}

export async function getCategoryService(id: string): Promise<CategoryType> {
  return adminApi.get(`/categories/${id}`).then((response) => response.data);
}

export async function updateCategoryService(
  id: string,
  data: CategoryType,
): Promise<HttpStatusCode> {
  const formData = new FormData();
  formDataAppender({
    formData,
    values: data,
  });
  return adminApi
    .put(`/categories/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => response.data);
}

export async function createCategoriesService(
  data: CreateCategoryType,
): Promise<HttpStatusCode> {
  const formData = new FormData();
  formDataAppender({
    formData,
    values: data,
  });
  return adminApi
    .post("/categories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => response.data);
}

export async function deleteCategoriesService(id: string) {
  return adminApi.delete(`/categories/${id}`).then((response) => response.data);
}
