import { login } from "@/integrations/api/services/auth";
import { setAccessToken, setRefreshToken, setUser } from "@/entities/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAccessToken(data.jwt);
      setRefreshToken(data.jwtRefresh);
      setUser(data.user);
      toast.success("Login successful!");
    },
    onError: (error: Error) => {
      toast.error(`Login failed: ${error.message}`);
    },
  });
};
