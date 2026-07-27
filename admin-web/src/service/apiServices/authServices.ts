import api from "../apiInstances/api.ts";
import adminApi from "../apiInstances/adminApi.ts";
import type {
  LoginResponseType,
  LoginType,
} from "../../utils/types/authTypes.ts";
import type { UserType } from "../../utils/types/userTypes.ts";

export async function loginService(
  data: LoginType,
): Promise<LoginResponseType> {
  return api.post("/auth/login", data).then((response) => response.data);
}

export async function getProfileService(): Promise<UserType> {
  return adminApi.get("/auth/profile").then((response) => response.data);
}
