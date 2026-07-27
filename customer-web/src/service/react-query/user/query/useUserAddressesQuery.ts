import { useQuery } from "@tanstack/react-query";
import { getUserAddressesService } from "@/src/service/apiServices/address.service";
import { AddressType } from "@/src/utils/types/address.type";

export const useUserAddressesQuery = () => {
  return useQuery<AddressType[], Error>({
    queryKey: ["user", "addresses"],
    queryFn: async () => {
      return await getUserAddressesService();
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retryOnMount: false,
    staleTime: 1000 * 60 * 60,
    retry: false,
  });
};
