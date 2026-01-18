"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { FormattedMessage } from "react-intl";

interface CountdownPanelProps {
  /**
   * Countdown value in seconds
   */
  countdown: number;
  /**
   * Whether the countdown is active (all seats full)
   */
  isActive: boolean;
  /**
   * Additional classes for container
   */
  className?: string;
}

/**
 * CountdownPanel - Right side panel showing countdown timer
 *
 * Shows:
 * - Large countdown number (e.g., "60")
 * - "Game will start soon" button/indicator when countdown is active
 */
export function CountdownPanel({ countdown, isActive, className }: CountdownPanelProps) {
  return (
    <div className={cn("flex flex-col items-center justify-between h-full", className)}>
      {/* Countdown number */}
      <div className="flex-1 flex items-center justify-center">
        <p
          className={cn(
            "font-space font-light text-[80px] md:text-[100px] lg:text-[128px] text-center tracking-[0.7px] uppercase transition-opacity duration-300",
            isActive ? "text-black" : "text-gray-300",
          )}
        >
          {countdown}
        </p>
      </div>

      {/* Game start button/indicator */}
      <div
        className={cn(
          "w-full bg-black h-[60px] flex items-center justify-center transition-opacity duration-300",
          isActive ? "opacity-100" : "opacity-50",
        )}
      >
        <p className="font-space font-bold text-sm leading-5 text-center text-white tracking-[0.7px] uppercase">
          {isActive ? (
            <FormattedMessage id="waiting_room.status.starting_soon" defaultMessage="Game will start soon" />
          ) : (
            <FormattedMessage id="waiting_room.status.waiting" defaultMessage="Waiting for players..." />
          )}
        </p>
      </div>
    </div>
  );
}
