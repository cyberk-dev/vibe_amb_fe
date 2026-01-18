"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";
import type { PlayerSeat } from "@/entities/player-seat";
import { WaitingRoomHeader } from "./waiting-room-header";
import { SeatsGrid } from "./seats-grid";
import { CountdownPanel } from "./countdown-panel";

export interface WaitingRoomProps {
  /**
   * Array of all player seats (20 seats)
   */
  seats: PlayerSeat[];
  /**
   * Maximum number of seats
   */
  maxSeats: number;
  /**
   * Countdown value in seconds
   */
  countdown: number;
  /**
   * Whether countdown is active (all seats are full)
   */
  isCountdownActive: boolean;
  /**
   * Whether sound is muted
   */
  isMuted: boolean;
  /**
   * Callback when sound toggle is clicked
   */
  onToggleMute: () => void;
  /**
   * Additional classes for container
   */
  className?: string;
}

/**
 * WaitingRoom - Main waiting room widget
 *
 * A complete waiting room UI that displays:
 * - Header with title, player count, and sound toggle
 * - Grid of player seats (5x4 = 20 seats)
 * - Countdown panel on the right side
 *
 * Design based on Figma node 4-151
 *
 * @example
 * ```tsx
 * <WaitingRoom
 *   seats={seats}
 *   maxSeats={20}
 *   countdown={60}
 *   isCountdownActive={false}
 *   isMuted={false}
 *   onToggleMute={() => setIsMuted(!isMuted)}
 * />
 * ```
 */
export function WaitingRoom({
  seats,
  maxSeats,
  countdown,
  isCountdownActive,
  isMuted,
  onToggleMute,
  className,
}: WaitingRoomProps) {
  const connectedPlayers = seats.filter((seat) => seat.isOccupied).length;

  return (
    <div
      className={cn(
        "min-h-screen w-full bg-[#fff7ed]",
        "bg-gradient-to-br from-[#fff7ed] via-white to-[#fef2f2]",
        className,
      )}
    >
      {/* Border frame */}
      <div className="min-h-screen border-8 border-custom-vivid-orange flex flex-col gap-8 px-4 py-8 sm:px-8 md:pl-[72px] md:pr-2 md:py-[48px]">
        {/* Header section */}
        <WaitingRoomHeader
          connectedPlayers={connectedPlayers}
          maxSeats={maxSeats}
          isMuted={isMuted}
          onToggleMute={onToggleMute}
        />

        {/* Main content: Seats grid + Countdown panel */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-4">
          {/* Seats grid - takes most of the space */}
          <div className="flex-1 lg:flex-[4]">
            <SeatsGrid seats={seats} />
          </div>

          {/* Countdown panel - right side */}
          <div className="w-full lg:w-[200px] lg:flex-shrink-0 lg:h-auto">
            <CountdownPanel countdown={countdown} isActive={isCountdownActive} />
          </div>
        </div>
      </div>
    </div>
  );
}
