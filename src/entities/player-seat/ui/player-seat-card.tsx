"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { PlayerSeat } from "../model/types";

export interface PlayerSeatCardProps extends React.ComponentPropsWithoutRef<"div"> {
  seat: PlayerSeat;
}

/**
 * PlayerSeatCard - Display a player seat with two states: occupied and waiting
 *
 * @example
 * // Occupied seat with ready player
 * <PlayerSeatCard
 *   seat={{
 *     seatNumber: 1,
 *     isOccupied: true,
 *     isReady: true,
 *     player: { name: "Manh", role: "PLAYER 1" }
 *   }}
 * />
 *
 * @example
 * // Empty waiting seat
 * <PlayerSeatCard
 *   seat={{
 *     seatNumber: 2,
 *     isOccupied: false
 *   }}
 * />
 */
export const PlayerSeatCard = React.forwardRef<HTMLDivElement, PlayerSeatCardProps>(
  ({ seat, className, ...props }, ref) => {
    const { seatNumber, isOccupied, isReady, player } = seat;

    return (
      <div
        ref={ref}
        className={cn(
          "border-2 border-solid pb-0.5 pt-[26px] px-[26px]",
          isOccupied ? "bg-white border-black" : "bg-[#f9fafb] border-[#d1d5dc]",
          className,
        )}
        {...props}
      >
        <div className="flex h-12 items-center justify-between">
          {/* Left section: Seat number + Player info */}
          <div className="flex gap-4 items-center">
            {/* Seat number badge */}
            <div
              className={cn(
                "size-12 flex items-center justify-center shrink-0",
                isOccupied ? "bg-black" : "bg-[#e5e7eb]",
              )}
            >
              <p
                className={cn(
                  "font-space text-[20px] font-bold leading-7",
                  isOccupied ? "text-white" : "text-custom-dark-grayish-blue",
                )}
              >
                {seatNumber}
              </p>
            </div>

            {/* Player info or waiting text */}
            <div className="flex flex-col">
              {isOccupied && player ? (
                <>
                  {/* Player name */}
                  <p className="font-space text-[18px] font-bold leading-7 text-black">{player.name}</p>
                  {/* Player role */}
                  <p className="font-space text-[12px] font-normal leading-4 tracking-[0.6px] uppercase text-[#6a7282]">
                    {player.role}
                  </p>
                </>
              ) : (
                <>
                  {/* Waiting text */}
                  <p className="font-space text-[18px] font-bold leading-7 text-custom-dark-grayish-blue">Waiting...</p>
                  {/* Empty slot label */}
                  <p className="font-space text-[12px] font-normal leading-4 tracking-[0.6px] uppercase text-custom-dark-grayish-blue">
                    Empty slot
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Right section: Ready indicator (only for occupied seats) */}
          {isOccupied && isReady && (
            <div className="size-2 rounded-full bg-[#00c950] opacity-96 shrink-0" aria-label="Player ready" />
          )}
        </div>
      </div>
    );
  },
);

PlayerSeatCard.displayName = "PlayerSeatCard";
