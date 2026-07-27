import { useQuery } from "@tanstack/react-query";
import { getOrdersService } from "@/src/service/apiServices/order.service";
import { OrderType } from "@/src/utils/types/order.type";

export const useOrdersQuery = () => {
  return useQuery<OrderType[], Error>({
    queryKey: ["user", "orders"],
    queryFn: async () => {
      return await getOrdersService();
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retryOnMount: false,
    staleTime: 1000 * 60 * 60,
    retry: false,
  });
};
