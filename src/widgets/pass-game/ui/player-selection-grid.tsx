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
 * - Responsive grid of player cards (auto-fit)
 * - Current user card is marked and can select themselves (keep own bao)
 * - Players who are already targets are disabled
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

      {/* Player grid: responsive with auto-fit */}
      <motion.div
        className="grid gap-2 sm:gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {players.map((player, index) => {
          const isCurrentUser = player.id === currentUserId;
          const isSelected = player.id === selectedPlayerId;

          // Determine variant based on state
          let variant: "default" | "selected" | "currentUser" | "acted" = "default";
          if (isSelected) {
            variant = "selected";
          } else if (player.isTarget) {
            variant = "acted"; // Anyone targeted shows orange
          } else if (isCurrentUser) {
            variant = "currentUser";
          }

          // Determine secondary label
          let secondaryLabel: string;
          if (isCurrentUser && player.isTarget) {
            secondaryLabel = "Đã chọn"; // Current user who is targeted
          } else if (isCurrentUser) {
            secondaryLabel = "You";
          } else if (player.isTarget) {
            secondaryLabel = "Đã được chọn"; // "Already selected"
          } else {
            secondaryLabel = `Player ${player.seatNumber}`;
          }

          // Disable clicking on targets (but not current user - they can keep own bao)
          const isDisabled = disabled || (player.isTarget && !isCurrentUser);

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
                onClick={() => !isDisabled && onPlayerClick(player.id)}
                disabled={isDisabled}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
