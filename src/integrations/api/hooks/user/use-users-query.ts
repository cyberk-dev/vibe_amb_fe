import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/integrations/api/services/user";

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
