import adminApi from "../apiInstances/adminApi.ts";
import type { HttpStatusCode } from "axios";
import type { CompanyDetailType } from "../../utils/types/companyDetailTypes.ts";
import formDataAppender from "../../utils/functions/formDataAppender.ts";

export async function createCompanyDetailService(
  data: CompanyDetailType,
): Promise<HttpStatusCode> {
  const formData = new FormData();
  formDataAppender({
    formData,
    values: data,
  });
  return adminApi
    .post("/companies", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => response.data);
}

export async function getCompaniesService(): Promise<CompanyDetailType[]> {
  return adminApi.get("/companies").then((response) => response.data);
}

export async function deleteCompanyDetailService(id: string) {
  return adminApi.delete(`/companies/${id}`).then((response) => response.data);
}

export async function getCompanyService(
  id: string,
): Promise<CompanyDetailType> {
  return adminApi.get(`/companies/${id}`).then((response) => response.data);
}

export async function updateCompanyDetailService(
  id: string,
  data: Partial<CompanyDetailType>,
): Promise<HttpStatusCode> {
  const formData = new FormData();
  formDataAppender({
    formData,
    values: data,
  });
  return adminApi
    .put(`/companies/${id}`, formData)
    .then((response) => response.data);
}
