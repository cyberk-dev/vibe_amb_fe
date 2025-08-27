import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { mockLogin, mockRegister, mockLogout } from "@/api/auth";
import { useAuthActions } from "@/stores/auth-store";
import { authKeys } from "./use-auth-query";

// Login mutation hook
export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const { login: updateAuthStore } = useAuthActions();

  return useMutation({
    mutationFn: mockLogin,
    onSuccess: (response) => {
      // Update auth store with user data
      updateAuthStore(response.user, response.tokens);
      
      // Update React Query cache
      queryClient.setQueryData(authKeys.user(), response.user);
      
      toast.success("Login successful!");
    },
    onError: (error: Error) => {
      toast.error(`Login failed: ${error.message}`);
    },
  });
};

// Register mutation hook
export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  const { login: updateAuthStore } = useAuthActions();

  return useMutation({
    mutationFn: mockRegister,
    onSuccess: (response) => {
      // Update auth store with user data
      updateAuthStore(response.user, response.tokens);
      
      // Update React Query cache
      queryClient.setQueryData(authKeys.user(), response.user);
      
      toast.success("Registration successful!");
    },
    onError: (error: Error) => {
      toast.error(`Registration failed: ${error.message}`);
    },
  });
};

// Logout mutation hook
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const { logout: clearAuthStore } = useAuthActions();

  return useMutation({
    mutationFn: mockLogout,
    onSuccess: () => {
      // Clear auth store
      clearAuthStore();
      
      // Clear React Query cache
      queryClient.removeQueries({ queryKey: authKeys.all });
      
      toast.success("Logged out successfully");
    },
    onError: (error: Error) => {
      toast.error(`Logout failed: ${error.message}`);
    },
  });
};

// Update profile mutation hook
export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  const { updateProfile } = useAuthActions();

  return useMutation({
    mutationFn: async (profileData: Partial<{ name: string }>) => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return profileData;
    },
    onMutate: async (profileData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: authKeys.user() });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(authKeys.user());

      // Optimistically update React Query cache
      queryClient.setQueryData(authKeys.user(), (old: unknown) => ({
        ...(old as Record<string, unknown>),
        ...profileData,
      }));

      return { previousUser };
    },
    onSuccess: (profileData) => {
      // Update auth store
      updateProfile(profileData);
      
      toast.success("Profile updated successfully");
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(authKeys.user(), context.previousUser);
      }
      toast.error(`Profile update failed: ${error.message}`);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
};