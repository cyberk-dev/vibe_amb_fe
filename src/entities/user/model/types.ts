import type { ApiTypes } from "@/shared/api";

// Re-export swagger types
export type User = ApiTypes.UserEntity;
export type Profile = ApiTypes.ProfileEntity;

// Derive UserRole from swagger type
export type UserRole = User["role"];
export const UserRole = {
  USER: "USER",
  ADMIN: "ADMIN",
  SUPERADMIN: "SUPERADMIN",
} as const;

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.USER]: 1,
  [UserRole.ADMIN]: 2,
  [UserRole.SUPERADMIN]: 3,
};

// Frontend-only types
export interface AuthUser {
  id?: number;
  username?: string;
  role?: UserRole;
  profileId?: number | null;
  walletAddress?: string | null;
}
