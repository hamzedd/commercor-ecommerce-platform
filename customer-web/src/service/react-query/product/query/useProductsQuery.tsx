import { useQuery } from "@tanstack/react-query";
import { getProductsService } from "@/src/service/apiServices/product.service";
import { PaginatedResponseType } from "@/src/utils/types/api.type";
import { ProductType } from "@/src/utils/types/product.type";

interface Props {
  page?: number;
  categoryId?: string;
  productFilterValues?: string[];
  initialData?: PaginatedResponseType<ProductType>;
  sortBy?: string;
}
export const useProductsQuery = ({
  page,
  categoryId,
  productFilterValues,
  initialData,
  sortBy,
}: Props) => {
  return useQuery<PaginatedResponseType<ProductType>, Error>({
    queryKey: [
      "products",
      "current",
      {
        page,
        categoryId,
        productFilterValues,
        sortBy,
      },
    ],
    queryFn: async () => {
      const res = await getProductsService(
        {
          page,
          ...(sortBy ? { sortBy: [sortBy] } : {}),
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
    initialData:
      page === 1 && !productFilterValues?.length && sortBy === "id:DESC"
        ? initialData
        : undefined,
    placeholderData: (previousData) => previousData,
  });
};
