import { initProfile, register } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: register,
    onSuccess: async (data) => {
      await initProfile(data.jwt);
      toast.success("Registration successful! You are now logged in.");
    },
    onError: (error: Error) => {
      toast.error(`Registration failed: ${error.message}`);
    },
  });
};
