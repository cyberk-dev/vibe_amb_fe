"use client";

import * as React from "react";
import { FormattedMessage } from "react-intl";
import { motion } from "framer-motion";
import { useLocale, useLocaleActions } from "@/shared/i18n";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const LANGUAGES = [
  { code: "en-US" as const, labelKey: "language.selector.english", flag: "🇺🇸" },
  { code: "vi" as const, labelKey: "language.selector.vietnamese", flag: "🇻🇳" },
];

export interface LanguageToggleButtonProps {
  /**
   * Style variant for different backgrounds
   * - "light": For dark/saturated backgrounds (white text, semi-transparent bg)
   * - "dark": For light backgrounds (dark text)
   * @default "dark"
   */
  variant?: "light" | "dark";
  /**
   * Additional classes for container positioning
   */
  className?: string;
}

export const LanguageToggleButton: React.FC<LanguageToggleButtonProps> = ({ variant = "dark", className }) => {
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

  // Variant-based styles
  const buttonBgClass =
    variant === "light"
      ? "bg-white/20 hover:bg-white/30 border-2 border-white"
      : "bg-white hover:bg-white/90 border-2 border-custom-vivid-red/30 hover:border-custom-vivid-red/50";
  const buttonTextClass = variant === "light" ? "text-white" : "text-custom-vivid-red";
  const chevronClass = variant === "light" ? "text-white" : "text-custom-vivid-red";

  if (!mounted) {
    return (
      <div className={cn("rounded-lg p-2", buttonBgClass, className)}>
        <button type="button" className="flex items-center gap-2 cursor-pointer" aria-label="Select language">
          <span className="text-lg">🇺🇸</span>
        </button>
      </div>
    );
  }

  const currentLanguage = LANGUAGES.find((lang) => lang.code === locale) || LANGUAGES[0];

  const handleLanguageChange = (langCode: "en-US" | "vi") => {
    setLocale(langCode);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <motion.div
        className={cn("rounded-lg p-1.5", buttonBgClass)}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          opacity: { delay: 0.5, duration: 0.3 },
          scale: { type: "spring" as const, stiffness: 300, damping: 20 },
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Select language"
          aria-expanded={isOpen}
          className={cn("flex items-center gap-2 cursor-pointer px-1", buttonTextClass)}
        >
          <span className="text-base">{currentLanguage.flag}</span>
          <span className="hidden sm:inline text-sm font-medium">
            <FormattedMessage id={currentLanguage.labelKey} />
          </span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", chevronClass, isOpen && "rotate-180")} />
        </button>
      </motion.div>

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
