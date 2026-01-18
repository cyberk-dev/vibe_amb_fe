import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PlayerRegistration } from "./types";

interface PlayerRegistrationState {
  registration: PlayerRegistration | null;
  setRegistration: (data: PlayerRegistration) => void;
  clearRegistration: () => void;
}

const usePlayerRegistrationStore = create<PlayerRegistrationState>()(
  persist(
    (set) => ({
      registration: null,
      setRegistration: (data) => set({ registration: data }),
      clearRegistration: () => set({ registration: null }),
    }),
    {
      name: "player-registration",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const usePlayerRegistration = () => usePlayerRegistrationStore((state) => state.registration);

export const useSetPlayerRegistration = () => usePlayerRegistrationStore((state) => state.setRegistration);

export const useClearPlayerRegistration = () => usePlayerRegistrationStore((state) => state.clearRegistration);
