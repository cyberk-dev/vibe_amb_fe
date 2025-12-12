export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.USER]: 1,
  [UserRole.ADMIN]: 2,
  [UserRole.SUPERADMIN]: 3,
};

export interface AuthUser {
  id?: number;
  username?: string;
  role?: UserRole;
  profileId?: number | null;
  walletAddress?: string | null;
}
