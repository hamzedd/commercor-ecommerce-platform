import { useQuery } from "@tanstack/react-query";
import { getOrdersService } from "@/src/service/apiServices/order.service";
import { OrderType } from "@/src/utils/types/order.type";

export const useOrdersQuery = () => {
  return useQuery<OrderType[], Error>({
    queryKey: ["user", "orders"],
    queryFn: async () => {
      return await getOrdersService();
    },
    // Order/fulfillment/payment status change server-side via admin
    // actions the customer doesn't control - always refetch on mount so a
    // revisit to the Orders tab shows the current state instead of
    // whatever was cached from an earlier visit in this session.
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    retryOnMount: false,
    staleTime: 0,
    retry: false,
  });
};
