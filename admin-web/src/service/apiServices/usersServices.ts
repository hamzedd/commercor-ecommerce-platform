import adminApi from "../apiInstances/adminApi.ts";
import type { UserCreateType, UserType } from "../../utils/types/userTypes.ts";
import type { HttpStatusCode } from "axios";

export async function getUsersService(): Promise<UserType[]> {
  return adminApi.get("/users").then((response) => response.data);
}
export async function addUsersService(
  data: UserCreateType,
): Promise<HttpStatusCode> {
  return adminApi.post("/users", data).then((response) => response.data);
}

export async function getUserService(id: string): Promise<UserType> {
  return adminApi.get(`/users/${id}`).then((response) => response.data);
}

export async function editUserService(
  id: string,
  data: UserCreateType,
): Promise<UserType> {
  return adminApi.put(`/users/${id}`, data).then((response) => response.data);
}

export async function deleteUserService(id: string): Promise<UserType> {
  return adminApi.delete(`/users/${id}`).then((response) => response.data);
}
