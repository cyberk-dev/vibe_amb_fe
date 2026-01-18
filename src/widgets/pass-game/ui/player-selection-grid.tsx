"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { FormattedMessage } from "react-intl";
import { cn } from "@/shared/lib/utils";
import type { GamePlayer } from "@/entities/game";
import { GamePlayerCard } from "@/entities/game";

// ========================================
// Animation Variants
// ========================================

const labelVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0.1,
    },
  },
};

const playerCardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

interface PlayerSelectionGridProps {
  /**
   * Array of all players in the game
   */
  players: GamePlayer[];
  /**
   * ID of the current user
   */
  currentUserId: string;
  /**
   * ID of the currently selected player (null if none)
   */
  selectedPlayerId: string | null;
  /**
   * Callback when a player is clicked
   */
  onPlayerClick: (playerId: string) => void;
  /**
   * Whether selection is disabled (e.g., already confirmed)
   */
  disabled?: boolean;
  /**
   * Additional classes for container
   */
  className?: string;
}

/**
 * PlayerSelectionGrid - Grid of player cards for selecting pass target
 *
 * Displays:
 * - "PASS TO PLAYER" label
 * - 5x4 grid of player cards
 * - Current user card is marked and cannot be selected
 * - Selected player has orange highlight
 */
export function PlayerSelectionGrid({
  players,
  currentUserId,
  selectedPlayerId,
  onPlayerClick,
  disabled = false,
  className,
}: PlayerSelectionGridProps) {
  return (
    <motion.div className={cn("flex flex-col gap-4", className)} initial="hidden" animate="visible">
      {/* Label */}
      <motion.p
        className="font-space text-xs font-normal leading-4 tracking-[1.2px] uppercase text-[#6a7282]"
        variants={labelVariants}
      >
        <FormattedMessage id="pass_game.pass_to_player" defaultMessage="Pass To Player" />
      </motion.p>

      {/* Player grid: 5 columns x 4 rows */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        variants={gridContainerVariants}
      >
        {players.map((player) => {
          const isCurrentUser = player.id === currentUserId;
          const isSelected = player.id === selectedPlayerId;

          // Determine variant based on state
          let variant: "default" | "selected" | "currentUser" = "default";
          if (isCurrentUser) {
            variant = "currentUser";
          } else if (isSelected) {
            variant = "selected";
          }

          // Determine secondary label
          let secondaryLabel: string;
          if (isCurrentUser) {
            secondaryLabel = "You";
          } else {
            secondaryLabel = `Player ${player.seatNumber}`;
          }

          return (
            <motion.div key={player.id} variants={playerCardVariants}>
              <GamePlayerCard
                player={player}
                variant={variant}
                secondaryLabel={secondaryLabel}
                onClick={() => !isCurrentUser && onPlayerClick(player.id)}
                disabled={disabled || isCurrentUser}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
