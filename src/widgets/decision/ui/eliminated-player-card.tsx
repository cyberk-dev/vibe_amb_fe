"use client";

import { motion } from "framer-motion";
import { FormattedMessage } from "react-intl";
import { cn } from "@/shared/lib/utils";
import type { EliminatedPlayer } from "./decision-widget";

const shakeAnimation = {
  x: [0, -5, 5, -5, 5, 0],
  transition: {
    duration: 0.5,
    delay: 0.5,
  },
};

interface EliminatedPlayerCardProps {
  player: EliminatedPlayer;
  className?: string;
}

/**
 * EliminatedPlayerCard - Shows the player eliminated this round
 *
 * Design:
 * - White background with red border
 * - Red square with seat number
 * - Player name and "ELIMINATED THIS ROUND" label
 * - Consolation prize badge on the right
 */
export function EliminatedPlayerCard({ player, className }: EliminatedPlayerCardProps) {
  return (
    <motion.div
      className={cn(
        "bg-white border-2 border-destructive",
        "px-6 py-6",
        "flex items-center justify-between",
        className,
      )}
      initial={{ opacity: 0, scale: 0.95, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ type: "spring" as const, stiffness: 100, damping: 15 }}
      whileInView={shakeAnimation}
    >
      {/* Left side - Player info */}
      <div className="flex items-center gap-4">
        {/* Seat number badge */}
        <motion.div
          className="size-12 bg-destructive flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" as const, stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <span className="font-space text-xl font-bold text-white">{player.seatNumber}</span>
        </motion.div>

        {/* Player details */}
        <div className="flex flex-col">
          <span className="font-space text-lg font-bold text-black">{player.name}</span>
          <span className="font-space text-xs font-normal uppercase tracking-[0.6px] text-destructive">
            <FormattedMessage id="decision.eliminated.eliminated_this_round" />
          </span>
        </div>
      </div>

      {/* Right side - Consolation prize */}
      <motion.div
        className="h-[52px] border-2 border-destructive bg-white px-6 flex items-center"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring" as const, stiffness: 100, damping: 15, delay: 0.3 }}
      >
        <span className="font-space text-base font-bold text-black">+${player.consolationPrize}</span>
      </motion.div>
    </motion.div>
  );
}
