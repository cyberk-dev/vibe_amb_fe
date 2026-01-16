import { useUserRole } from "@/entities/auth";
import { UserRole, hasRole } from "@/entities/user";

export const useHasRole = (requiredRole: UserRole): boolean => {
  const userRole = useUserRole();
  return hasRole(userRole, requiredRole);
};
