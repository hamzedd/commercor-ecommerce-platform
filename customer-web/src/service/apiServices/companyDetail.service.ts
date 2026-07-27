import api from "@/src/service/apis/api";

import { CompanyDetailType } from "@/src/utils/types/companyDetail.type";
import { CompanyDetailEnum } from "@/src/utils/enums/CompanyDetail.enum";

export async function getCompanyDetailsService(): Promise<CompanyDetailType[]> {
  return api.get("/company-details").then((res) => res.data);
}

export async function getCompanyDetailByKeyService(
  key: CompanyDetailEnum,
): Promise<CompanyDetailType> {
  return api.get(`/company-details/${key}`).then((res) => res.data);
}
