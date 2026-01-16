import { useUserRole } from "@/entities/auth";
import { UserRole, hasMinimumRole } from "@/entities/user";

export const useMinimumRole = (minimumRole: UserRole): boolean => {
  const userRole = useUserRole();
  return hasMinimumRole(userRole, minimumRole);
};
