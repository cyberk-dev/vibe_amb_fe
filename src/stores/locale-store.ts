import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Locale } from "@/integrations/react-intl/messages";
import { useEffect } from "react";

interface LocaleState {
  locale: Locale;
  actions: {
    setLocale: (locale: Locale) => void;
  };
}

// Private store - NOT exported
const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: "en-US", // default locale
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
      skipHydration: true, // Prevent automatic hydration to avoid SSR issues
      version: 1,
    },
  ),
);

// Exported atomic selectors
export const useLocale = () => useLocaleStore((state) => state.locale);
export const useLocaleActions = () => useLocaleStore((state) => state.actions);

// Hydration helper - use this in the LocalizationProvider to manually hydrate
export const useHydrateLocaleStore = () => {
  useEffect(() => {
    useLocaleStore.persist.rehydrate();
  }, []);
};
