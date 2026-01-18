"use client";

import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { PageHeader } from "./page-header";

export interface ScreenWrapperProps {
  /**
   * Content to render inside the wrapper
   */
  children: ReactNode;
  /**
   * Background class for the full-screen container
   * e.g., "bg-custom-vivid-red", "bg-[#fff7ed]"
   */
  bgClassName?: string;
  /**
   * Border class for the full-screen container
   * e.g., "border-8 border-[#f54900]"
   */
  borderClassName?: string;
  /**
   * Style variant for header controls
   * - "light": For dark/saturated backgrounds
   * - "dark": For light backgrounds
   * @default "dark"
   */
  headerVariant?: "light" | "dark";
  /**
   * Whether to show the page header
   * @default true
   */
  showHeader?: boolean;
  /**
   * Whether to show the sound button in header
   * @default true
   */
  showSound?: boolean;
  /**
   * Additional classes for the outer container
   */
  className?: string;
  /**
   * Additional classes for the content container (max-width wrapper)
   */
  contentClassName?: string;
}

/**
 * ScreenWrapper - Common layout wrapper for all screens
 *
 * Provides:
 * - Full-screen background with customizable bg/border
 * - Page header with disconnect, language, and sound controls
 * - Max-width content container (1440px)
 *
 * @example
 * ```tsx
 * // For saturated background screens (like invite-code)
 * <ScreenWrapper
 *   bgClassName="bg-custom-vivid-red"
 *   headerVariant="light"
 * >
 *   <YourContent />
 * </ScreenWrapper>
 *
 * // For light background screens (like landing, waiting-room)
 * <ScreenWrapper
 *   bgClassName="bg-[#fff7ed]"
 *   borderClassName="border-8 border-[#f54900]"
 *   headerVariant="dark"
 * >
 *   <YourContent />
 * </ScreenWrapper>
 * ```
 */
export function ScreenWrapper({
  children,
  bgClassName,
  borderClassName,
  headerVariant = "dark",
  showHeader = true,
  showSound = true,
  className,
  contentClassName,
}: ScreenWrapperProps) {
  return (
    <div className={cn("min-h-screen w-full relative", bgClassName, borderClassName, className)}>
      {/* Page header with controls */}
      {showHeader && <PageHeader variant={headerVariant} showSound={showSound} />}

      {/* Max-width content container */}
      <div className={cn("mx-auto max-w-[1440px] h-full", contentClassName)}>{children}</div>
    </div>
  );
}
