"use client";

import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "@/shared/ui/button";
import { useLocale, useLocaleActions } from "@/stores/locale-store";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const LANGUAGES = [
  { code: "en-US" as const, labelKey: "language.selector.english", flag: "🇺🇸" },
  { code: "vi" as const, labelKey: "language.selector.vietnamese", flag: "🇻🇳" },
];

export const LanguageToggleButton: React.FC = () => {
  const locale = useLocale();
  const { setLocale } = useLocaleActions();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Select language">
        <span className="text-lg">🇺🇸</span>
      </Button>
    );
  }

  const currentLanguage = LANGUAGES.find((lang) => lang.code === locale) || LANGUAGES[0];

  const handleLanguageChange = (langCode: "en-US" | "vi") => {
    setLocale(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        aria-expanded={isOpen}
        className="flex items-center gap-2 h-9"
      >
        <span className="text-base">{currentLanguage.flag}</span>
        <span className="hidden sm:inline text-sm">
          <FormattedMessage id={currentLanguage.labelKey} />
        </span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md border bg-popover shadow-lg z-50 animate-in fade-in-0 zoom-in-95">
          <div className="p-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus:bg-accent focus:text-accent-foreground focus:outline-none",
                  locale === lang.code && "bg-accent",
                )}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="flex-1 text-left">
                  <FormattedMessage id={lang.labelKey} />
                </span>
                {locale === lang.code && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
