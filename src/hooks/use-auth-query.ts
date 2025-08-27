import { useQuery } from "@tanstack/react-query";
import type { User } from "@/stores/auth-store";

// Query key factory for auth
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  profile: (id: string) => [...authKeys.all, "profile", id] as const,
};

// Mock function to get current user (normally would be an API call)
const fetchCurrentUser = async (): Promise<User | null> => {
  // In a real app, this would fetch from /api/auth/me
  // For demo purposes, we'll return null (not authenticated via API)
  return null;
};

// Current user query hook
export const useCurrentUserQuery = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry auth failures
  });
};