"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import type { PlayerSeat } from "@/entities/player-seat";
import { WaitingRoomHeader } from "./waiting-room-header";
import { SeatsGrid } from "./seats-grid";
import { CountdownPanel } from "./countdown-panel";

// ========================================
// Animation Variants
// ========================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      staggerChildren: 0.15,
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
      delay: 0.3,
    },
  },
};

export interface WaitingRoomProps {
  /**
   * Array of all player seats (20 seats)
   */
  seats: PlayerSeat[];
  /**
   * Maximum number of seats
   */
  maxSeats: number;
  /**
   * Countdown value in seconds
   */
  countdown: number;
  /**
   * Whether countdown is active (all seats are full)
   */
  isCountdownActive: boolean;
  /**
   * Additional classes for container
   */
  className?: string;
}

/**
 * WaitingRoom - Main waiting room widget
 *
 * A complete waiting room UI that displays:
 * - Header with title, player count, and sound toggle
 * - Grid of player seats (5x4 = 20 seats)
 * - Countdown panel on the right side
 *
 * Design based on Figma node 4-151
 *
 * @example
 * ```tsx
 * <WaitingRoom
 *   seats={seats}
 *   maxSeats={20}
 *   countdown={60}
 *   isCountdownActive={false}
 * />
 * ```
 */
export function WaitingRoom({ seats, maxSeats, countdown, isCountdownActive, className }: WaitingRoomProps) {
  const connectedPlayers = seats.filter((seat) => seat.isOccupied).length;

  return (
    <div
      className={cn(
        "min-h-screen w-full bg-[#fff7ed]",
        "bg-gradient-to-br from-[#fff7ed] via-white to-[#fef2f2]",
        className,
      )}
    >
      {/* Border frame */}
      <motion.div
        className="min-h-screen border-8 border-custom-vivid-orange flex flex-col gap-8 px-4 py-8 sm:px-8 md:pl-[72px] md:pr-2 md:py-[48px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header section */}
        <WaitingRoomHeader connectedPlayers={connectedPlayers} maxSeats={maxSeats} />

        {/* Main content: Seats grid + Countdown panel */}
        <motion.div className="flex flex-col lg:flex-row gap-8 lg:gap-4" variants={mainContentVariants}>
          {/* Seats grid - takes most of the space */}
          <div className="flex-1 lg:flex-[4]">
            <SeatsGrid seats={seats} />
          </div>

          {/* Countdown panel - right side */}
          <div className="w-full lg:w-[200px] lg:flex-shrink-0 lg:h-auto">
            <CountdownPanel countdown={countdown} isActive={isCountdownActive} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
