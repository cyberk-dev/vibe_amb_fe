"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccessToken } from "@/stores/auth-store";
import { useIsAuthStoreHydrated } from "@/stores/hydration.store";

interface UseProtectedOptions {
  /**
   * Path to redirect to when user is not authenticated
   * @default "/auth"
   */
  redirectTo?: string;
  /**
   * Whether to redirect immediately or just return the auth state
   * @default true
   */
  shouldRedirect?: boolean;
}

interface UseProtectedReturn {
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuthProtected = (options: UseProtectedOptions = {}): UseProtectedReturn => {
  const { redirectTo = "/auth", shouldRedirect = true } = options;

  const router = useRouter();
  const isHydrated = useIsAuthStoreHydrated();
  const accessToken = useAccessToken();

  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(accessToken);

  useEffect(() => {
    // Wait for hydration to complete
    if (!isHydrated) {
      return;
    }

    setIsLoading(false);

    // Redirect if not authenticated and shouldRedirect is true
    if (!isAuthenticated && shouldRedirect) {
      router.push(redirectTo);
    }
  }, [isHydrated, isAuthenticated, shouldRedirect, redirectTo, router]);

  return {
    isLoading,
    isAuthenticated,
  };
};
