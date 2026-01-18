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

// NOTE: Variants below are kept for reference but not used
// Direct animation props are used instead to avoid nested context conflicts

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        className="font-space text-xs font-normal leading-4 tracking-[1.2px] uppercase text-custom-dark-grayish-blue"
        variants={labelVariants}
      >
        <FormattedMessage id="pass_game.pass_to_player" defaultMessage="Pass To Player" />
      </motion.p>

      {/* Player grid: auto-fit columns based on available width */}
      <motion.div
        className="grid grid-cols-2 gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {players.map((player, index) => {
          const isCurrentUser = player.id === currentUserId;
          const isSelected = player.id === selectedPlayerId;

          // Determine variant based on state
          // Priority: acted current user > currentUser > selected > acted > default
          let variant: "default" | "selected" | "currentUser" | "acted" = "default";
          if (isCurrentUser && player.hasActed) {
            variant = "acted"; // Current user who has acted shows orange
          } else if (isCurrentUser) {
            variant = "currentUser"; // Current user who hasn't acted shows black
          } else if (isSelected) {
            variant = "selected";
          } else if (player.hasActed) {
            variant = "acted";
          }

          // Determine secondary label
          let secondaryLabel: string;
          if (isCurrentUser && player.hasActed) {
            secondaryLabel = "Đã chọn"; // Show "Đã chọn" instead of "You"
          } else if (isCurrentUser) {
            secondaryLabel = "You";
          } else {
            secondaryLabel = `Player ${player.seatNumber}`;
          }

          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 12,
                delay: index * 0.02,
              }}
            >
              <GamePlayerCard
                player={player}
                variant={variant}
                secondaryLabel={secondaryLabel}
                onClick={() => !isCurrentUser && !player.hasActed && onPlayerClick(player.id)}
                disabled={disabled || isCurrentUser || player.hasActed}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
