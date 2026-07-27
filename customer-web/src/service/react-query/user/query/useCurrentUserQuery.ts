import { useQuery } from "@tanstack/react-query";
import { currentUserService } from "@/src/service/apiServices/auth.service";
import { CustomerProfileType } from "@/src/utils/types/customer.type";

export const useCurrentUserQuery = () => {
  return useQuery<CustomerProfileType, Error>({
    queryKey: ["user", "current"],
    queryFn: async () => {
      const res = await currentUserService();
      if (res?.id) {
        return res;
      }
      throw new Error("No current user found");
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retryOnMount: false,
    staleTime: 1000 * 60 * 60,
    retry: false,
  });
};
