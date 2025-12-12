import { useUserRole } from "@/stores/auth-store";
import { UserRole } from "@/lib/types/auth.types";
import { hasMinimumRole } from "@/lib/helpers/rbac";

export const useMinimumRole = (minimumRole: UserRole): boolean => {
  const userRole = useUserRole();
  return hasMinimumRole(userRole, minimumRole);
};
