"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Locale } from "./messages";
import { useEffect } from "react";

interface LocaleState {
  locale: Locale;
  actions: {
    setLocale: (locale: Locale) => void;
  };
}

const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: "vi",
      actions: {
        setLocale: (locale) => set({ locale }),
      },
    }),
    {
      name: "locale-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        locale: state.locale,
      }),
      skipHydration: true,
      version: 1,
    },
  ),
);

export const useLocale = () => useLocaleStore((state) => state.locale);
export const useLocaleActions = () => useLocaleStore((state) => state.actions);

export const useHydrateLocaleStore = () => {
  useEffect(() => {
    useLocaleStore.persist.rehydrate();
  }, []);
};
