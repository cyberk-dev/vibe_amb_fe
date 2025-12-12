import { useMutation, useQueryClient } from "@tanstack/react-query";
import { demoteFromAdmin } from "@/integrations/api/services/user";
import { toast } from "sonner";

export const useDemoteAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: demoteFromAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Admin demoted to User successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to demote admin: ${error.message}`);
    },
  });
};
