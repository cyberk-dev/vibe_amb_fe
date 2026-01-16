import { apiClient } from "@/integrations/api/core/client";
import { UserRole } from "@/entities/user";

interface TokenResponse {
  jwt?: string | null | undefined;
  jwtRefresh?: string | null | undefined;
  user?: {
    id?: number;
    username?: string;
    role?: UserRole;
    profileId?: null | number;
    walletAddress?: string | null;
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  jwt: string;
  jwtRefresh: string;
  user: {
    id: number;
    username: string;
    role: UserRole;
    profileId: number;
  };
}
interface NonceResponse {
  nonce: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface VerifySiweRequest {
  message: string;
  signature: string;
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/local", credentials);
  return response.data;
};

export const register = async (credentials: RegisterRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/local/register", credentials);
  return response.data;
};

export const authCallback = async ({ provider, accessToken }: { provider: string; accessToken: string }) => {
  const response = await apiClient.get<TokenResponse>(`/auth/${provider}/callback?access_token=${accessToken}`);
  return response.data;
};

export const initProfile = async (accessToken?: string) => {
  const response = await apiClient.post<TokenResponse>(
    "/auth/init-profile",
    {},
    {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {},
    },
  );
  return response.data;
};

export const getNonce = async (address?: string): Promise<NonceResponse> => {
  const res = await apiClient.get("/auth/siwe/nonce", {
    params: {
      address,
    },
  });
  return res.data;
};

export const verifySiwe = async (data: VerifySiweRequest): Promise<TokenResponse> => {
  const res = await apiClient.post("/auth/siwe", data);
  return res.data;
};

export const signout = async (): Promise<void> => {
  await apiClient.post("/auth/signout");
};
