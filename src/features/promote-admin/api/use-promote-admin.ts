import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi, userQueries } from "@/entities/user";
import { toast } from "sonner";

export const usePromoteAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.promoteToAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueries.all() });
      toast.success("User promoted to Admin successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to promote user: ${error.message}`);
    },
  });
};
