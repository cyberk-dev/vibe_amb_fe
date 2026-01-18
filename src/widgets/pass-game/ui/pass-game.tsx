"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";
import type { GamePlayer, GameHost, RedPacket } from "@/entities/game";
import { PassGameHeader } from "./pass-game-header";
import { YourPacketPanel } from "./your-packet-panel";
import { PlayerSelectionGrid } from "./player-selection-grid";
import { ConfirmPassButton } from "./confirm-pass-button";

export interface PassGameProps {
  /**
   * Current round number
   */
  round: number;
  /**
   * Countdown timer value in seconds
   */
  countdown: number;
  /**
   * All players in the game
   */
  players: GamePlayer[];
  /**
   * Current user's player ID
   */
  currentUserId: string;
  /**
   * Game host/admin info
   */
  host: GameHost;
  /**
   * Current user's red packet
   */
  packet?: RedPacket;
  /**
   * URL for packet image
   */
  packetImageUrl?: string;
  /**
   * Currently selected player ID for passing
   */
  selectedPlayerId: string | null;
  /**
   * Callback when a player is clicked for selection
   */
  onPlayerSelect: (playerId: string) => void;
  /**
   * Callback when confirm pass button is clicked
   */
  onConfirmPass: () => void;
  /**
   * Whether pass action is in progress
   */
  isPassing?: boolean;
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
 * PassGame - Main pass game widget
 *
 * A complete pass game UI that displays:
 * - Header with game status, title, countdown, round, sound toggle, and host badge
 * - Left panel: User's red packet
 * - Right panel: Player selection grid
 * - Confirm pass button
 *
 * Based on Figma node 4-227 (Pass screen)
 *
 * @example
 * ```tsx
 * <PassGame
 *   round={1}
 *   countdown={60}
 *   players={players}
 *   currentUserId="user-1"
 *   host={{ name: "Mr. Horse", role: "Admin" }}
 *   packetImageUrl="/images/red-packet.png"
 *   selectedPlayerId={selectedId}
 *   onPlayerSelect={handleSelect}
 *   onConfirmPass={handleConfirm}
 *   isMuted={false}
 *   onToggleMute={() => {}}
 * />
 * ```
 */
export function PassGame({
  round,
  countdown,
  players,
  currentUserId,
  host,
  packet,
  packetImageUrl,
  selectedPlayerId,
  onPlayerSelect,
  onConfirmPass,
  isPassing = false,
  isMuted,
  onToggleMute,
  className,
}: PassGameProps) {
  const hasSelection = selectedPlayerId !== null;

  return (
    <div className={cn("min-h-screen w-full bg-[#fff7ed]", className)}>
      {/* Border frame */}
      <div className="min-h-screen border-8 border-[#e7000b] flex flex-col gap-4 px-4 py-8 sm:px-8 md:pl-[72px] md:pr-2 md:py-[48px]">
        {/* Header section */}
        <PassGameHeader round={round} countdown={countdown} host={host} isMuted={isMuted} onToggleMute={onToggleMute} />

        {/* Main content: Packet panel + Player grid */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left panel: Your packet */}
          <div className="w-full lg:w-auto lg:shrink-0">
            <YourPacketPanel packet={packet} imageUrl={packetImageUrl} />
          </div>

          {/* Right panel: Player selection + Confirm button */}
          <div className="flex-1 flex flex-col gap-4 items-end">
            <PlayerSelectionGrid
              players={players}
              currentUserId={currentUserId}
              selectedPlayerId={selectedPlayerId}
              onPlayerClick={onPlayerSelect}
              disabled={isPassing}
              className="w-full"
            />

            {/* Confirm button */}
            <ConfirmPassButton hasSelection={hasSelection} isPending={isPassing} onClick={onConfirmPass} />
          </div>
        </div>
      </div>
    </div>
  );
}
