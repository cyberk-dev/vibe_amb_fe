import { useMutation, useQueryClient } from "@tanstack/react-query";
import { promoteToAdmin } from "@/integrations/api/services/user";
import { toast } from "sonner";

export const usePromoteAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: promoteToAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User promoted to Admin successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to promote user: ${error.message}`);
    },
  });
};
