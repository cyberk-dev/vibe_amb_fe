"use client";

import * as React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useIntl, FormattedMessage } from "react-intl";
import { cn } from "@/shared/lib/utils";
import type { GameHost } from "@/entities/game";
import { GameHostBadge } from "@/entities/game";

interface PassGameHeaderProps {
  /**
   * Current round number
   */
  round: number;
  /**
   * Countdown timer value in seconds
   */
  countdown: number;
  /**
   * Game host/admin info
   */
  host: GameHost;
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
 * PassGameHeader - Header section of the pass game screen
 *
 * Displays:
 * - "GAME IN PROGRESS" label
 * - "Pass" title with countdown
 * - "Your turn to pass" subtitle
 * - Round indicator and sound toggle (right side)
 * - Admin host badge (right side)
 */
export function PassGameHeader({ round, countdown, host, isMuted, onToggleMute, className }: PassGameHeaderProps) {
  const intl = useIntl();

  return (
    <div className={cn("flex items-start justify-between", className)}>
      {/* Left section: Title */}
      <div className="flex flex-col gap-2">
        {/* Game in progress label */}
        <p className="font-space text-xs font-normal leading-4 tracking-[1.2px] uppercase text-[#e7000b]">
          <FormattedMessage id="pass_game.game_in_progress" defaultMessage="Game In Progress" />
        </p>

        {/* Main title: Pass + Countdown */}
        <div className="flex items-baseline gap-2">
          <span className="font-bricolage font-bold text-[128px] md:text-[160px] lg:text-[96px] leading-[0.85] text-black">
            <FormattedMessage id="pass_game.pass" defaultMessage="Pass" />
          </span>
          <span className="font-bricolage font-light text-[80px] md:text-[100px] lg:text-[104px] leading-[0.85] text-black">
            {countdown}
          </span>
        </div>

        {/* Subtitle */}
        <p className="font-space text-sm font-normal leading-5 tracking-[0.7px] uppercase text-[#4a5565]">
          <FormattedMessage id="pass_game.your_turn_to_pass" defaultMessage="Your turn to pass" />
        </p>
      </div>

      {/* Right section: Round, sound toggle, and host badge */}
      <div className="flex flex-col items-end gap-6">
        {/* Top row: Round indicator and sound toggle */}
        <div className="flex gap-2.5 items-center">
          {/* Round indicator */}
          <div className="border-2 border-[#e7000b] flex items-center justify-center px-[18px] py-[10px] h-10">
            <p className="font-space text-xs font-normal leading-4 tracking-[1.2px] uppercase text-[#e7000b] whitespace-nowrap">
              <FormattedMessage id="pass_game.round" defaultMessage="Round {number}" values={{ number: round }} />
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

        {/* Host badge */}
        <GameHostBadge host={host} />
      </div>
    </div>
  );
}
