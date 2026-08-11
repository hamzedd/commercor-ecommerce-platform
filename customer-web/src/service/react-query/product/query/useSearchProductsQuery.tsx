import { useQuery } from "@tanstack/react-query";
import { getProductsService } from "@/src/service/apiServices/product.service";
import { PaginatedResponseType } from "@/src/utils/types/api.type";
import { ProductType } from "@/src/utils/types/product.type";

export const useSearchProductsQuery = ({ search }: { search: string }) => {
  return useQuery<PaginatedResponseType<ProductType>, Error>({
    queryKey: ["products", "search", search],
    enabled: Boolean(search && search.length > 0),
    queryFn: async () => {
      const res = await getProductsService({
        search,
      });
      if (res?.data) {
        return res;
      }
      throw new Error("Products Not found");
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retryOnMount: false,
    retry: false,
  });
};
