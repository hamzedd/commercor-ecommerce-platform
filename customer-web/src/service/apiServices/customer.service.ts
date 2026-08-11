import api from "@/src/service/apis/api";

import {
  RegisterCustomerRequestType,
  UpdateCustomerProfileRequestType,
} from "@/src/utils/types/customer.type";
import { HttpStatusCode } from "axios";

export async function registerCustomerService(
  data: RegisterCustomerRequestType,
): Promise<HttpStatusCode> {
  return api.post("/customers", data).then((res) => res.data);
}
export async function updateCustomerProfileService(
  data: UpdateCustomerProfileRequestType,
): Promise<HttpStatusCode> {
  return api.put("/customers", data).then((res) => res.data);
}
