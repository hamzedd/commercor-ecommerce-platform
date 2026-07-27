import api from "@/src/service/apis/api";
import {
  GetProductsRequestType,
  ProductType,
} from "@/src/utils/types/product.type";
import fetchApi from "@/src/service/apis/fetchApi";
import {
  PaginatedRequestParamsType,
  PaginatedResponseType,
} from "@/src/utils/types/api.type";
import { paginatedRequestQueryParamsFormat } from "@/src/utils/functions/paginatedRequestQueryParamsFormat";

export async function getProductsService(
  params: PaginatedRequestParamsType,
  data: GetProductsRequestType = {},
): Promise<PaginatedResponseType<ProductType>> {
  const queryParams = paginatedRequestQueryParamsFormat(params);
  return api
    .post("/products", data, { params: queryParams })
    .then((res) => res.data);
}

export async function fetchProducts(
  params: PaginatedRequestParamsType,
): Promise<PaginatedResponseType<ProductType>> {
  const queryParams = paginatedRequestQueryParamsFormat(params);
  return fetchApi(`/products?${queryParams.toString()}`, {
    next: {
      tags: ["products", queryParams.toString()],
      revalidate: 1000 * 60 * 5,
    },
    method: "POST",
  });
}

export async function fetchProduct(slug: string): Promise<ProductType> {
  return fetchApi(`/products/slug/${slug}`, {
    next: {
      tags: ["products", "slugs", slug],
      revalidate: 1000 * 60 * 5,
    },
  });
}

export async function getProductByIdService(
  id: ProductType["id"],
): Promise<ProductType> {
  return api.get(`/products/${id}`).then((res) => res.data);
}
