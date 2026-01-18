"use client";

import * as React from "react";
import { FormattedMessage } from "react-intl";
import { cn } from "@/shared/lib/utils";
import type { EliminatedPlayer } from "./decision-widget";

interface EliminatedPlayerCardProps {
  player: EliminatedPlayer;
  className?: string;
}

/**
 * EliminatedPlayerCard - Shows the player eliminated this round
 *
 * Design:
 * - White background with red border
 * - Red square with seat number
 * - Player name and "ELIMINATED THIS ROUND" label
 * - Consolation prize badge on the right
 */
export function EliminatedPlayerCard({ player, className }: EliminatedPlayerCardProps) {
  return (
    <div
      className={cn(
        "bg-white border-2 border-destructive",
        "px-6 py-6",
        "flex items-center justify-between",
        className,
      )}
    >
      {/* Left side - Player info */}
      <div className="flex items-center gap-4">
        {/* Seat number badge */}
        <div className="size-12 bg-destructive flex items-center justify-center">
          <span className="font-space text-xl font-bold text-white">{player.seatNumber}</span>
        </div>

        {/* Player details */}
        <div className="flex flex-col">
          <span className="font-space text-lg font-bold text-black">{player.name}</span>
          <span className="font-space text-xs font-normal uppercase tracking-[0.6px] text-destructive">
            <FormattedMessage id="decision.eliminated.eliminated_this_round" />
          </span>
        </div>
      </div>

      {/* Right side - Consolation prize */}
      <div className="h-[52px] border-2 border-destructive bg-white px-6 flex items-center">
        <span className="font-space text-base font-bold text-black">+${player.consolationPrize}</span>
      </div>
    </div>
  );
}
