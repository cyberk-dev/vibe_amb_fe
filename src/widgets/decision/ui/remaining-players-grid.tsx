"use client";

import { motion } from "framer-motion";
import { FormattedMessage } from "react-intl";
import { cn } from "@/shared/lib/utils";
import type { DecisionPlayer } from "./decision-widget";

// ========================================
// Animation Variants
// ========================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0.1,
    },
  },
};

const chipVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
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

interface RemainingPlayersGridProps {
  players: DecisionPlayer[];
  className?: string;
}

interface PlayerChipProps {
  player: DecisionPlayer;
}

/**
 * PlayerChip - Individual player chip with vote status
 *
 * States:
 * - share: Teal background (voted to share)
 * - continue: Orange background (voted to continue)
 * - pending: White background with black border (not voted)
 */
function PlayerChip({ player }: PlayerChipProps) {
  const voteStatus = player.voteStatus ?? "pending";

  const chipStyles = {
    share: "bg-custom-teal/20 border-custom-teal",
    continue: "bg-custom-vivid-red/10 border-custom-vivid-red",
    pending: "bg-white border-black",
  };

  return (
    <motion.div
      className={cn("h-[60px] border-2 px-6 py-2", "flex items-center gap-3", chipStyles[voteStatus])}
      variants={chipVariants}
      whileHover={{ scale: 1.02 }}
      layout
    >
      {/* Seat number badge */}
      <div className="size-8 bg-black flex items-center justify-center flex-shrink-0">
        <span className="font-space text-sm font-bold text-white">{player.seatNumber}</span>
      </div>

      {/* Player name */}
      <span className="font-space text-sm font-bold text-black truncate">{player.name}</span>
    </motion.div>
  );
}

/**
 * RemainingPlayersGrid - Grid of remaining players with vote status
 *
 * Shows all remaining players as chips with their vote status:
 * - Teal: Voted to share
 * - Orange: Voted to continue
 * - White: Not yet voted
 */
export function RemainingPlayersGrid({ players, className }: RemainingPlayersGridProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Section label */}
      <motion.p
        className="font-space text-xs font-normal uppercase tracking-[3.6px] text-black/40"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring" as const, stiffness: 100, damping: 15 }}
      >
        <FormattedMessage id="decision.remaining_players.label" />
      </motion.p>

      {/* Players grid - wrapping flex */}
      <motion.div className="flex flex-wrap gap-3" variants={containerVariants} initial="hidden" animate="visible">
        {players.map((player) => (
          <PlayerChip key={player.id} player={player} />
        ))}
      </motion.div>
    </div>
  );
}
