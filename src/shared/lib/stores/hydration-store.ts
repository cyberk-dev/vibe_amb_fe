import { create } from "zustand";

interface HydrationState {
  isAuthStoreHydrated: boolean;
}

const initialState: HydrationState = {
  isAuthStoreHydrated: false,
};

const useHydrationStore = create<HydrationState>()(() => ({
  ...initialState,
}));

export const useIsAuthStoreHydrated = () => useHydrationStore((state) => state.isAuthStoreHydrated);

export const setIsAuthStoreHydrated = (isAuthStoreHydrated: boolean) =>
  useHydrationStore.setState({ isAuthStoreHydrated });
