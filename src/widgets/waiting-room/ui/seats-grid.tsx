"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { PlayerSeatCard, type PlayerSeat } from "@/entities/player-seat";
import { FormattedMessage } from "react-intl";

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
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
};

const seatCardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
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
    <motion.div className={cn("flex flex-col gap-6", className)} initial="hidden" animate="visible">
      {/* Connected players label */}
      <motion.p
        className="font-space text-xs font-normal leading-4 tracking-[1.2px] uppercase text-[#6a7282]"
        variants={labelVariants}
      >
        <FormattedMessage id="waiting_room.connected_players" defaultMessage="Connected Players" />
      </motion.p>

      {/* 5x4 grid of seats */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        variants={gridContainerVariants}
      >
        {seats.map((seat) => (
          <motion.div key={seat.seatNumber} variants={seatCardVariants}>
            <PlayerSeatCard seat={seat} className="w-full min-w-[180px] h-[100px]" />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
