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
    staleTime: 1000 * 60 * 60,
    retry: false,
  });
};
