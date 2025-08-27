import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

// Create axios instance
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});


// Simplified approach - we'll handle auth in the components instead
let currentTokens: { accessToken: string; refreshToken: string; expiresAt: number } | null = null;
let authLogoutCallback: (() => void) | null = null;

export const setAuthTokens = (tokens: typeof currentTokens) => {
  currentTokens = tokens;
};

export const setLogoutCallback = (callback: () => void) => {
  authLogoutCallback = callback;
};

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    if (currentTokens?.accessToken) {
      config.headers.Authorization = `Bearer ${currentTokens.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (authLogoutCallback) {
        authLogoutCallback();
      }
      toast.error("Please login again");
    } else if (error.response?.status === 403) {
      toast.error("You do not have permission to perform this action");
    } else if (error.response && error.response.status >= 500) {
      toast.error("Server error. Please try again later.");
    } else if (!error.response) {
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
