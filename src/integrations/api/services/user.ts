import { apiClient } from "@/integrations/api/core/client";
import { UserRole } from "@/lib/types/auth.types";

export interface User {
  id: number;
  username: string;
  role: UserRole;
  profileId?: number | null;
  createdAt?: string;
  confirmed?: boolean;
}

// Get all users from backend
export const getUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<User[]>("/user");
  return response.data;
};

export const promoteToAdmin = async (userId: number): Promise<void> => {
  await apiClient.patch(`/user/promote-admin/${userId}`);
};

export const demoteFromAdmin = async (userId: number): Promise<void> => {
  await apiClient.patch(`/user/demote-admin/${userId}`);
};
