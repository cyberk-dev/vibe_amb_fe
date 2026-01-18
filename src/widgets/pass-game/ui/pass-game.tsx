"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import type { GamePlayer, RedPacket } from "@/entities/game";
import { PassGameHeader } from "./pass-game-header";
import { YourPacketPanel } from "./your-packet-panel";
import { PlayerSelectionGrid } from "./player-selection-grid";
import { ConfirmPassButton } from "./confirm-pass-button";

// ========================================
// Animation Variants
// ========================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const mainContentVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
      delay: 0.2,
    },
  },
};

const confirmButtonVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      delay: 0.5,
    },
  },
};

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
 *   packetImageUrl="/images/red-packet.png"
 *   selectedPlayerId={selectedId}
 *   onPlayerSelect={handleSelect}
 *   onConfirmPass={handleConfirm}
 * />
 * ```
 */
export function PassGame({
  round,
  countdown,
  players,
  currentUserId,
  packet,
  selectedPlayerId,
  onPlayerSelect,
  onConfirmPass,
  isPassing = false,
  className,
}: PassGameProps) {
  const hasSelection = selectedPlayerId !== null;

  return (
    <div className={cn("min-h-screen w-full bg-[#fff7ed]", className)}>
      {/* Border frame */}
      <motion.div
        className="min-h-screen border-8 border-[#e7000b] flex flex-col gap-4 px-4 py-8 sm:px-8 md:px-[64px] md:py-[48px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header section */}
        <PassGameHeader round={round} countdown={countdown} />

        {/* Main content: Packet panel + Player grid */}
        <motion.div className="flex flex-col lg:flex-row gap-4 lg:gap-12" variants={mainContentVariants}>
          {/* Left panel: Your packet */}
          <div className="w-full lg:w-auto lg:shrink-0">
            <YourPacketPanel packet={packet} />
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
            <motion.div variants={confirmButtonVariants}>
              <ConfirmPassButton hasSelection={hasSelection} isPending={isPassing} onClick={onConfirmPass} />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
