import { ProductFilterWithOptionsType } from "@/src/utils/types/productFilter.type";
import fetchApi from "../apis/fetchApi";

export async function fetchProductFiltersByCategoryId(
  categoryId: string,
): Promise<ProductFilterWithOptionsType[]> {
  return fetchApi("/product-filters", {
    params: {
      categoryId,
    },
  });
}
