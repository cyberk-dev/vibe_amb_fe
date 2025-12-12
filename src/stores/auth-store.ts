import { persist } from "zustand/middleware";
import { createControlledStore } from "@/stores/controlled-store";
import { setIsAuthStoreHydrated } from "@/stores/hydration.store";
import { AuthUser } from "@/lib/types/auth.types";

const AUTH_STORE_KEY = "auth-storage";

interface AuthProps {
  accessToken?: string;
  refreshToken?: string;
  user?: AuthUser;
}

interface AuthState extends AuthProps {}

const initialState: AuthProps = {
  accessToken: undefined,
  refreshToken: undefined,
  user: undefined,
};

const useAuthStore = createControlledStore<AuthState>()(
  persist(
    () => ({
      ...initialState,
    }),
    {
      name: AUTH_STORE_KEY,
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
      onRehydrateStorage: () => {
        return (_, error) => {
          if (error) {
            console.error("an error happened during hydration", error);
          } else {
            setIsAuthStoreHydrated(true);
          }
        };
      },
    },
  ),
);

export const useAccessToken = () => useAuthStore((state) => state.accessToken);
export const useRefreshToken = () => useAuthStore((state) => state.refreshToken);
export const useUser = () => useAuthStore((state) => state.user);
export const useUserRole = () => useAuthStore((state) => state.user?.role);

export const resetAuthStore = () => useAuthStore.setState(initialState);

export const signOut = () => {
  resetAuthStore();
};

export const setAccessToken = (accessToken: string) =>
  useAuthStore.setState({
    accessToken,
  });

export const setRefreshToken = (refreshToken: string) =>
  useAuthStore.setState({
    refreshToken,
  });

export const setTokens = (accessToken: string, refreshToken: string) =>
  useAuthStore.setState({
    accessToken,
    refreshToken,
  });

export const setUser = (user: AuthUser) =>
  useAuthStore.setState({
    user,
  });

export const setAuthData = (auth: AuthProps) => useAuthStore.setState(auth);

export const setTokensAndProfile = (accessToken: string, refreshToken: string) =>
  useAuthStore.setState({
    accessToken,
    refreshToken,
  });

export const getAccessToken = () => useAuthStore.getState().accessToken;
export const getRefreshToken = () => useAuthStore.getState().refreshToken;
export const getUser = () => useAuthStore.getState().user;
