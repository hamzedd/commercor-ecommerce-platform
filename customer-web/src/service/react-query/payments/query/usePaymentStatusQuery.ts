import { useQuery } from "@tanstack/react-query";
import { GetPaymentStatusResponseType } from "@/src/utils/types/payment.type";
import { checkPaymentStatusService } from "@/src/service/apiServices/payment.service";

export const usePaymentStatusQuery = ({ id }: { id?: string }) => {
  return useQuery<GetPaymentStatusResponseType, Error>({
    enabled: !!id,
    queryKey: ["payment", "status", id],
    queryFn: async () => {
      return await checkPaymentStatusService(id!);
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retryOnMount: false,
    staleTime: 0,
    refetchInterval: (query) =>
      query.state.data?.status === "pending" && query.state.dataUpdateCount < 15
        ? 2000
        : false,
    retry: false,
  });
};
