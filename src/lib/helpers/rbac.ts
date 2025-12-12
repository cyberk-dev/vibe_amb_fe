import { UserRole, ROLE_HIERARCHY } from "@/lib/types/auth.types";

export const hasRole = (userRole: UserRole | undefined, requiredRole: UserRole): boolean => {
  return userRole === requiredRole;
};

export const hasMinimumRole = (userRole: UserRole | undefined, minimumRole: UserRole): boolean => {
  if (!userRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole];
};

export const hasAnyRole = (userRole: UserRole | undefined, requiredRoles: UserRole[]): boolean => {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
};

export const isAdmin = (userRole: UserRole | undefined): boolean => {
  return hasMinimumRole(userRole, UserRole.ADMIN);
};

export const isSuperAdmin = (userRole: UserRole | undefined): boolean => {
  return userRole === UserRole.SUPERADMIN;
};
