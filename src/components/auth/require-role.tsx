"use client";

import { ReactNode } from "react";
import { useRequireRole } from "@/hooks/use-require-role";
import { UserRole } from "@/lib/types/auth.types";
import { Loader2 } from "lucide-react";

interface RequireRoleProps {
  role: UserRole | UserRole[];
  fallback?: ReactNode;
  unauthorizedFallback?: ReactNode;
  children: ReactNode;
}

export const RequireRole = ({ role, fallback, unauthorizedFallback, children }: RequireRoleProps) => {
  const { isLoading, hasPermission } = useRequireRole(role, { shouldRedirect: false });

  if (isLoading) {
    return fallback || <Loader2 className="animate-spin" />;
  }

  if (!hasPermission) {
    return unauthorizedFallback || null;
  }

  return <>{children}</>;
};
