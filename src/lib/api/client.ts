import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import { useAuthStore } from "../stores/auth-store";
import { ErrorReporter, addBreadcrumb } from "../error-reporting";

// Create axios instance
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Mock refresh token function
const mockRefreshToken = async (refreshToken: string) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock successful refresh
  return {
    accessToken: `new-access-token-${Date.now()}`,
    refreshToken: `new-refresh-token-${Date.now()}`,
    expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour from now
  };
};

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const { tokens } = useAuthStore.getState();

    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }

    // Add breadcrumb for API request
    addBreadcrumb(
      `API Request: ${config.method?.toUpperCase()} ${config.url}`,
      "http",
      "info",
      {
        url: config.url,
        method: config.method,
        hasAuth: !!tokens?.accessToken,
      },
    );

    return config;
  },
  (error) => {
    ErrorReporter.reportError(error, {
      tags: { section: "api_request_interceptor" },
    });
    return Promise.reject(error);
  },
);

// Response interceptor - Handle token refresh
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const { tokens, setTokens, logout, isTokenExpired } =
        useAuthStore.getState();

      if (!tokens || !tokens.refreshToken) {
        logout();
        toast.error("Please login again");
        return Promise.reject(error);
      }

      if (isTokenExpired()) {
        originalRequest._retry = true;

        if (isRefreshing) {
          // If already refreshing, wait for the new token
          return new Promise((resolve) => {
            addRefreshSubscriber((newToken: string) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(apiClient(originalRequest));
            });
          });
        }

        isRefreshing = true;

        try {
          const newTokens = await mockRefreshToken(tokens.refreshToken);
          setTokens(newTokens);
          onTokenRefreshed(newTokens.accessToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          logout();
          toast.error("Session expired. Please login again.");
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }

    // Handle other errors and log them
    if (error.response?.status === 403) {
      toast.error("You do not have permission to perform this action");
    } else if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
      // Log server errors
      ErrorReporter.reportError(error, {
        tags: {
          section: "api_server_error",
          status_code: error.response.status.toString(),
        },
        extra: {
          url: error.config?.url,
          method: error.config?.method,
          responseData: error.response.data,
        },
      });
    } else if (!error.response) {
      toast.error("Network error. Please check your connection.");
      // Log network errors
      ErrorReporter.reportError(error, {
        tags: { section: "api_network_error" },
        extra: {
          url: error.config?.url,
          method: error.config?.method,
        },
      });
    } else if (error.response?.status >= 400 && error.response?.status < 500) {
      // Log client errors (except 401 which is handled above)
      if (error.response.status !== 401) {
        ErrorReporter.reportWarning(
          `API Client Error: ${error.response.status}`,
          {
            tags: {
              section: "api_client_error",
              status_code: error.response.status.toString(),
            },
            extra: {
              url: error.config?.url,
              method: error.config?.method,
              responseData: error.response.data,
            },
          },
        );
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
