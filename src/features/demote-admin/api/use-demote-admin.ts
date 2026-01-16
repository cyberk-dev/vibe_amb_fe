import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi, userQueries } from "@/entities/user";
import { toast } from "sonner";

export const useDemoteAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.demoteFromAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueries.all() });
      toast.success("Admin demoted to User successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to demote admin: ${error.message}`);
    },
  });
};
