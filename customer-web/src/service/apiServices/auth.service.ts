import api from "@/src/service/apis/api";

import {
  CustomerLoginRequestType,
  CustomerLoginResponseType,
  CustomerProfileType,
} from "@/src/utils/types/customer.type";

export async function customerLoginService(
  data: CustomerLoginRequestType,
): Promise<CustomerLoginResponseType> {
  return api.post("/auth/login", data).then((res) => res.data);
}

export async function currentUserService(): Promise<CustomerProfileType> {
  return api.get("/auth/profile").then((res) => res.data);
}
