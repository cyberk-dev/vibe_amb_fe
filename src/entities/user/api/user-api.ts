import { apiClient } from "@/shared/api";
import { UserRole } from "../model/types";

export interface User {
  id: number;
  username: string;
  role: UserRole;
  profileId?: number | null;
  createdAt?: string;
  confirmed?: boolean;
}

export const userApi = {
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>("/user");
    return response.data;
  },

  promoteToAdmin: async (userId: number): Promise<void> => {
    await apiClient.patch(`/user/promote-admin/${userId}`);
  },

  demoteFromAdmin: async (userId: number): Promise<void> => {
    await apiClient.patch(`/user/demote-admin/${userId}`);
  },
};
