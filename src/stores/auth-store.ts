import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name: string;
  address?: string;
  ensName?: string;
  isConnected?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface AuthActions {
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  updateProfile: (profile: Partial<User>) => void;
  checkTokenExpiry: () => void;
  setLoading: (loading: boolean) => void;
}

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  actions: AuthActions;
}

// Private store - NOT exported
const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isLoading: false,
      isAuthenticated: false,
      actions: {
        login: (user, tokens) => {
          set({
            user,
            tokens,
            isAuthenticated: true,
            isLoading: false,
          });
        },
        logout: () => {
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
          });
        },
        updateProfile: (profile) => {
          const currentUser = get().user;
          if (currentUser) {
            set({ user: { ...currentUser, ...profile } });
          }
        },
        checkTokenExpiry: () => {
          const { tokens } = get();
          if (!tokens || Date.now() >= tokens.expiresAt) {
            set({
              user: null,
              tokens: null,
              isAuthenticated: false,
            });
          }
        },
        setLoading: (loading) => {
          set({ isLoading: loading });
        },
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
        // actions excluded from persistence
      }),
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0) {
          // Handle migration from v0 to v1 if needed
        }
        return persistedState as AuthState;
      },
    },
  ),
);

// Exported atomic selectors
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthTokens = () => useAuthStore((state) => state.tokens);
export const useAuthActions = () => useAuthStore((state) => state.actions);
