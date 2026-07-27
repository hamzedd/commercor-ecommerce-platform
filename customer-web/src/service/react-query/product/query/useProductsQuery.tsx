import { useQuery } from "@tanstack/react-query";
import { getProductsService } from "@/src/service/apiServices/product.service";
import { PaginatedResponseType } from "@/src/utils/types/api.type";
import { ProductType } from "@/src/utils/types/product.type";

interface Props {
  page?: number;
  categoryId?: string;
  productFilterValues?: string[];
  initialData?: PaginatedResponseType<ProductType>;
}
export const useProductsQuery = ({
  page,
  categoryId,
  productFilterValues,
  initialData,
}: Props) => {
  return useQuery<PaginatedResponseType<ProductType>, Error>({
    queryKey: [
      "products",
      "current",
      {
        page,
        categoryId,
        productFilterValues,
      },
    ],
    queryFn: async () => {
      const res = await getProductsService(
        {
          page,
          ...(categoryId
            ? {
                filter: {
                  categoryId,
                },
              }
            : {}),
        },
        productFilterValues?.length
          ? {
              productFilterValues,
            }
          : {},
      );
      if (res) {
        return res;
      }
      throw new Error("No Products found");
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retryOnMount: false,
    staleTime: 1000 * 60 * 60,
    retry: false,
  });
};
