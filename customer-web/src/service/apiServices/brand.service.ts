import { BrandType } from "@/src/utils/types/brand.type";
import fetchApi from "@/src/service/apis/fetchApi";

export async function fetchBrands(): Promise<BrandType[]> {
  return fetchApi("/brands", {
    method: "GET",
    next: {
      revalidate: 1000 * 60 * 10,
    },
  });
}
