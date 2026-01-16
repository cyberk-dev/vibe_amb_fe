"use client";

import { ReactNode } from "react";
import { useUserRole } from "@/entities/auth";
import { UserRole, hasAnyRole } from "@/entities/user";

interface ShowForRoleProps {
  role: UserRole | UserRole[];
  fallback?: ReactNode;
  children: ReactNode;
}

export const ShowForRole = ({ role, fallback, children }: ShowForRoleProps) => {
  const userRole = useUserRole();
  const roles = Array.isArray(role) ? role : [role];
  const hasPermission = hasAnyRole(userRole, roles);

  return hasPermission ? <>{children}</> : <>{fallback}</>;
};
