"use client";

import { cn } from "@/shared/lib/utils";
import { DisconnectButton } from "./disconnect-button";
import { LanguageToggleButton } from "./language-toggle-button";
import { SoundButton } from "./sound-button";

export interface PageHeaderProps {
  /**
   * Style variant for different backgrounds
   * - "light": For dark/saturated backgrounds (white text, semi-transparent bg)
   * - "dark": For light backgrounds (dark text)
   * @default "dark"
   */
  variant?: "light" | "dark";
  /**
   * Whether to show the sound button
   * @default true
   */
  showSound?: boolean;
  /**
   * Additional classes for container positioning
   */
  className?: string;
}

/**
 * PageHeader - Common header with disconnect, language, and sound controls
 *
 * A reusable header component that displays:
 * - Disconnect button
 * - Language toggle button
 * - Sound button (optional)
 *
 * Features:
 * - Two style variants for different backgrounds
 * - Absolute positioning at top-right
 * - Consistent styling across all pages
 *
 * @example
 * ```tsx
 * // For dark/saturated backgrounds (like invite-code screen)
 * <PageHeader variant="light" />
 *
 * // For light backgrounds (most other screens)
 * <PageHeader variant="dark" />
 *
 * // Without sound button
 * <PageHeader variant="dark" showSound={false} />
 * ```
 */
export function PageHeader({ variant = "dark", showSound = true, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-center gap-3 z-20", className)}>
      <LanguageToggleButton variant={variant} />
      {showSound && <SoundButton variant={variant} />}
      <DisconnectButton variant={variant} />
    </div>
  );
}
