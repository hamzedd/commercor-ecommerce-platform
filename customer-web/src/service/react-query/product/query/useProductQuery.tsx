import { useQuery } from "@tanstack/react-query";
import { ProductType } from "@/src/utils/types/product.type";
import { getProductByIdService } from "@/src/service/apiServices/product.service";

interface Props {
  id: ProductType["id"];
}
export const useProductQuery = ({ id }: Props) => {
  return useQuery<ProductType, Error>({
    queryKey: ["products", id],
    queryFn: async () => {
      const res = await getProductByIdService(id);
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
