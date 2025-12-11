import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { tokenRefreshService } from "@/integrations/api/core/token-refresh";
import { getAccessToken } from "@/stores/auth-store";

// Create axios instance
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.example.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    // Check if token is expiring soon and refresh proactively
    try {
      const refreshResult = await tokenRefreshService.refreshTokenIfExpiringSoon(5);
      if (refreshResult) {
        console.log("Token refreshed proactively before request");
      }
    } catch (error) {
      console.warn("Proactive token refresh failed:", error);
    }

    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error: AxiosError) {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    const res = error.response;

    if (res?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokenResponse = await tokenRefreshService.refreshToken();

        if (tokenResponse.jwt && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${tokenResponse.jwt}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(error);
      }
    }

    if (res?.status) {
      console.error("Looks like there was a problem. Status Code: " + res.status);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
