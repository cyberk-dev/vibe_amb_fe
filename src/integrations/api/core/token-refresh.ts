import axios from "axios";
import type { AxiosResponse } from "axios";
import { signOut as authStoreSignOut, getAccessToken, getRefreshToken, setAccessToken } from "@/stores/auth-store";
import { isTokenExpiringSoon } from "@/lib/helpers/jwt";

interface TokenResponse {
  jwt: string;
  jwtRefresh?: string;
}

class TokenRefreshService {
  private refreshPromise: Promise<TokenResponse> | null = null;

  async refreshToken(): Promise<TokenResponse> {
    // If already refreshing, return the same promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      this.signOut();
      throw new Error("No refresh token available");
    }

    if (!process.env.REFRESH_TOKEN_API_URL) {
      this.signOut();
      throw new Error("No refresh token API URL available");
    }

    // Create refresh promise
    this.refreshPromise = axios
      .get<TokenResponse>(process.env.REFRESH_TOKEN_API_URL, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      })
      .then((response: AxiosResponse<TokenResponse>) => {
        const { jwt: accessToken } = response.data;
        setAccessToken(accessToken);
        return response.data;
      })
      .catch((error) => {
        this.signOut();
        throw error;
      })
      .finally(() => {
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  private signOut(): void {
    authStoreSignOut();
  }

  shouldRefreshProactively(thresholdMinutes: number = 5): boolean {
    // Don't refresh if already refreshing
    if (this.refreshPromise) {
      return false;
    }

    const accessToken = getAccessToken();
    if (!accessToken) {
      return false;
    }

    return isTokenExpiringSoon(accessToken, thresholdMinutes);
  }

  async refreshTokenIfExpiringSoon(thresholdMinutes: number = 5): Promise<TokenResponse | null> {
    if (this.shouldRefreshProactively(thresholdMinutes)) {
      return this.refreshToken();
    }

    return null;
  }
}

export const tokenRefreshService = new TokenRefreshService();
