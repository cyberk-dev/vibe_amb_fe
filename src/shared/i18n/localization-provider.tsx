"use client";

import React from "react";
import { IntlProvider } from "react-intl";
import { messages, initialLocale } from "./messages";
import { useLocale, useHydrateLocaleStore } from "./locale-store";

export const LocalizationProvider = ({ children }: { children: React.ReactNode }) => {
  useHydrateLocaleStore();

  const locale = useLocale();
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  const currentLocale = hydrated ? locale : initialLocale;

  return (
    <IntlProvider messages={messages[currentLocale]} locale={currentLocale} defaultLocale={initialLocale}>
      {children}
    </IntlProvider>
  );
};
