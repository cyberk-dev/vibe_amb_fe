"use client";

import React from "react";
import { IntlProvider } from "react-intl";
import { messages, initialLocale } from "./messages";
import { useLocale, useHydrateLocaleStore } from "@/shared/i18n";

export const LocalizationProvider = ({ children }: { children: React.ReactNode }) => {
  // Manually hydrate the store from localStorage
  useHydrateLocaleStore();

  const locale = useLocale();
  const [hydrated, setHydrated] = React.useState(false);

  // Wait for hydration to complete before using persisted locale
  React.useEffect(() => {
    setHydrated(true);
  }, []);

  // Use initialLocale during SSR and before hydration to prevent mismatch
  const currentLocale = hydrated ? locale : initialLocale;

  return (
    <IntlProvider messages={messages[currentLocale]} locale={currentLocale} defaultLocale={initialLocale}>
      {children}
    </IntlProvider>
  );
};
