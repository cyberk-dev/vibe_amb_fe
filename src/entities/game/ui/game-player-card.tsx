"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { GamePlayer } from "../model/types";

export type GamePlayerCardVariant = "default" | "selected" | "currentUser";

export interface GamePlayerCardProps extends React.ComponentPropsWithoutRef<"button"> {
  /**
   * Player data to display
   */
  player: GamePlayer;
  /**
   * Visual variant of the card
   * - default: Black seat badge, white background
   * - selected: Orange seat badge with check icon, light orange background
   * - currentUser: Black seat badge with number, white background (cannot be selected)
   */
  variant?: GamePlayerCardVariant;
  /**
   * Secondary label to display (e.g., "You", "Player 1")
   */
  secondaryLabel?: string;
}

/**
 * GamePlayerCard - Interactive player card for pass game
 *
 * Used in the player selection grid. Shows player seat number, name, and role.
 * Has three states: default (can select), selected (chosen target), currentUser (self, cannot select).
 *
 * @example
 * // Default selectable player
 * <GamePlayerCard
 *   player={{ id: "1", name: "Player", seatNumber: 2 }}
 *   secondaryLabel="Player 2"
 * />
 *
 * @example
 * // Selected player (pass target)
 * <GamePlayerCard
 *   player={{ id: "2", name: "Player", seatNumber: 3 }}
 *   variant="selected"
 *   secondaryLabel="Player 3"
 * />
 *
 * @example
 * // Current user (cannot select)
 * <GamePlayerCard
 *   player={{ id: "3", name: "Manh", seatNumber: 1, isCurrentUser: true }}
 *   variant="currentUser"
 *   secondaryLabel="You"
 * />
 */
export const GamePlayerCard = React.forwardRef<HTMLButtonElement, GamePlayerCardProps>(
  ({ player, variant = "default", secondaryLabel, className, disabled, ...props }, ref) => {
    const { seatNumber, name, isCurrentUser } = player;

    // Determine if this is the current user card
    const isCurrentUserCard = variant === "currentUser" || isCurrentUser;
    const isSelected = variant === "selected";

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled || isCurrentUserCard}
        className={cn(
          "w-[178px] h-[100px] flex items-center px-6 py-6 transition-all",
          // Background and border based on variant
          isSelected
            ? "bg-[#ffefe4] border-4 border-custom-light-orange"
            : "bg-white border-2 border-black hover:border-custom-light-orange",
          // Disabled state for current user
          isCurrentUserCard && "cursor-default hover:border-black",
          !isCurrentUserCard && !isSelected && "cursor-pointer hover:bg-[#fffcfa]",
          className,
        )}
        {...props}
      >
        <div className="flex gap-4 items-center">
          {/* Seat number badge */}
          <div
            className={cn(
              "size-12 flex items-center justify-center shrink-0",
              isSelected ? "bg-custom-light-orange" : "bg-black",
            )}
          >
            {isSelected ? (
              <Check className="size-6 text-white" strokeWidth={3} />
            ) : (
              <span className="font-space text-[20px] font-bold leading-7 text-white">
                {isCurrentUserCard ? seatNumber : "x"}
              </span>
            )}
          </div>

          {/* Player info */}
          <div className="flex flex-col items-start">
            {/* Player name */}
            <p className="font-space text-[18px] font-bold leading-7 text-black">{name}</p>
            {/* Secondary label */}
            {secondaryLabel && (
              <p className="font-space text-[12px] font-normal leading-4 tracking-[0.6px] uppercase text-[#6a7282]">
                {secondaryLabel}
              </p>
            )}
          </div>
        </div>
      </button>
    );
  },
);

GamePlayerCard.displayName = "GamePlayerCard";
