"use client";

import * as React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useIntl, FormattedMessage } from "react-intl";
import { cn } from "@/shared/lib/utils";

interface WaitingRoomHeaderProps {
  /**
   * Current number of connected players
   */
  connectedPlayers: number;
  /**
   * Maximum seats available
   */
  maxSeats: number;
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
 * WaitingRoomHeader - Header section of the waiting room
 *
 * Displays:
 * - "MATCHMAKING" label and "Waiting Room" title
 * - Player count indicator (e.g., "1 / 20")
 * - Sound toggle button
 */
export function WaitingRoomHeader({
  connectedPlayers,
  maxSeats,
  isMuted,
  onToggleMute,
  className,
}: WaitingRoomHeaderProps) {
  const intl = useIntl();

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-start justify-between">
        {/* Left section: Title */}
        <div className="flex flex-col gap-2">
          {/* Matchmaking label */}
          <p className="font-space text-xs font-normal leading-4 tracking-[1.2px] uppercase text-custom-vivid-orange">
            <FormattedMessage id="waiting_room.matchmaking" defaultMessage="Matchmaking" />
          </p>
          {/* Main title */}
          <div className="font-bricolage font-bold text-[80px] md:text-[100px] lg:text-[128px] leading-[0.94] text-black">
            <p>
              <FormattedMessage id="waiting_room.title" defaultMessage="Waiting Room" />
            </p>
          </div>
        </div>

        {/* Right section: Player count and sound toggle */}
        <div className="flex gap-4 items-start">
          {/* Player count indicator */}
          <div className="border-2 border-custom-vivid-orange flex items-center justify-center px-[18px] py-[10px] h-10">
            <p className="font-space text-xs font-normal leading-4 tracking-[1.2px] uppercase text-custom-vivid-orange whitespace-nowrap">
              {connectedPlayers} / {maxSeats}
            </p>
          </div>

          {/* Sound toggle button */}
          <button
            type="button"
            onClick={onToggleMute}
            className="bg-custom-light-orange p-2 rounded-lg flex items-center justify-center"
            aria-label={
              isMuted
                ? intl.formatMessage({ id: "waiting_room.aria.unmute", defaultMessage: "Unmute sound" })
                : intl.formatMessage({ id: "waiting_room.aria.mute", defaultMessage: "Mute sound" })
            }
          >
            {isMuted ? <VolumeX className="size-6 text-white" /> : <Volume2 className="size-6 text-white" />}
          </button>
        </div>
      </div>
    </div>
  );
}
