import { STALE_TIME } from "@/constants";
import { getCategories } from "@/lib/http";
import { useQuery } from "@tanstack/react-query";

export const useQueryCategories = () => {

  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => await getCategories({ isForProducts: true }),
    staleTime: STALE_TIME,
  });
};
