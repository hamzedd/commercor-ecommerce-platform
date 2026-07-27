import api from "@/src/service/apis/api";

import {
  AddressType,
  CreateAddressRequestType,
} from "@/src/utils/types/address.type";
import { HttpStatusCode } from "axios";

export async function createAddressService(
  data: CreateAddressRequestType,
): Promise<HttpStatusCode> {
  return api.post("/addresses", data).then((res) => res.data);
}

export async function getUserAddressesService(): Promise<AddressType[]> {
  return api.get("/addresses").then((res) => res.data);
}

export async function updateAddressService(
  id: string,
  data: CreateAddressRequestType,
): Promise<HttpStatusCode> {
  return api.put(`/addresses/${id}`, data).then((res) => res.data);
}

export async function deleteAddressService(
  id: string,
): Promise<HttpStatusCode> {
  return api.delete(`/addresses/${id}`).then((res) => res.data);
}
