import { useUserRole } from "@/stores/auth-store";
import { UserRole } from "@/lib/types/auth.types";
import { hasRole } from "@/lib/helpers/rbac";

export const useHasRole = (requiredRole: UserRole): boolean => {
  const userRole = useUserRole();
  return hasRole(userRole, requiredRole);
};
