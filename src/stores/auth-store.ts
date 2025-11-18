import { persist } from "zustand/middleware";
import { createControlledStore } from "@/stores/controlled-store";
import { setIsAuthStoreHydrated } from "@/stores/hydration.store";

const AUTH_STORE_KEY = "auth-storage";

interface AuthProps {
  accessToken?: string;
  refreshToken?: string;
  user?: {
    profileId?: number | null;
  };
}

interface AuthState extends AuthProps {}
// define the initial state
const initialState: AuthProps = {
  accessToken: undefined,
  refreshToken: undefined,
  user: undefined,
};

// create store
const useAuthStore = createControlledStore<AuthState>()(
  persist(
    () => ({
      ...initialState,
    }),
    {
      name: AUTH_STORE_KEY, // unique name for localStorage key
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }), // persist tokens and user profile
      onRehydrateStorage: () => {
        // optional
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

export const setUser = (user: { profileId?: number | null }) =>
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
