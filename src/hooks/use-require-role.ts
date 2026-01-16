"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/entities/auth";
import { useIsAuthStoreHydrated } from "@/shared/lib/stores";
import { UserRole, hasAnyRole } from "@/entities/user";

interface UseRequireRoleOptions {
  redirectTo?: string;
  shouldRedirect?: boolean;
}

export const useRequireRole = (requiredRole: UserRole | UserRole[], options: UseRequireRoleOptions = {}) => {
  const { redirectTo = "/unauthorized", shouldRedirect = true } = options;
  const router = useRouter();
  const isHydrated = useIsAuthStoreHydrated();
  const userRole = useUserRole();
  const [isLoading, setIsLoading] = useState(true);

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  const hasPermission = hasAnyRole(userRole, roles);

  useEffect(() => {
    if (!isHydrated) return;

    setIsLoading(false);

    if (!hasPermission && shouldRedirect) {
      router.push(redirectTo);
    }
  }, [isHydrated, hasPermission, shouldRedirect, redirectTo, router]);

  return { isLoading, hasPermission };
};
