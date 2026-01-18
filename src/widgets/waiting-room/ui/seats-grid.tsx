"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { PlayerSeatCard, type PlayerSeat } from "@/entities/player-seat";
import { FormattedMessage } from "react-intl";

interface SeatsGridProps {
  /**
   * Array of player seats (20 seats)
   */
  seats: PlayerSeat[];
  /**
   * Additional classes for container
   */
  className?: string;
}

/**
 * SeatsGrid - Grid display of all player seats
 *
 * Displays:
 * - "CONNECTED PLAYERS" label
 * - 5x4 grid of player seat cards
 */
export function SeatsGrid({ seats, className }: SeatsGridProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Connected players label */}
      <p className="font-space text-xs font-normal leading-4 tracking-[1.2px] uppercase text-custom-dark-grayish-blue">
        <FormattedMessage id="waiting_room.connected_players" defaultMessage="Connected Players" />
      </p>

      {/* 5x4 grid of seats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {seats.map((seat) => (
          <PlayerSeatCard key={seat.seatNumber} seat={seat} className="w-full min-w-[180px] h-[100px]" />
        ))}
      </div>
    </div>
  );
}
