import { UserRole } from "../model/types";

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.USER]: "User",
  [UserRole.ADMIN]: "Admin",
  [UserRole.SUPERADMIN]: "Super Admin",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  [UserRole.USER]: "bg-gray-100 text-gray-800",
  [UserRole.ADMIN]: "bg-blue-100 text-blue-800",
  [UserRole.SUPERADMIN]: "bg-purple-100 text-purple-800",
};
