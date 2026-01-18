"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { FormattedMessage } from "react-intl";
import { cn } from "@/shared/lib/utils";

// ========================================
// Animation Variants
// ========================================

const labelVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, x: -80, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 70,
      damping: 15,
      delay: 0.1,
    },
  },
};

const playerCountVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 15,
      delay: 0.2,
    },
  },
};

interface WaitingRoomHeaderProps {
  /**
   * Current number of connected players
   */
  connectedPlayers: number;
  /**
   * Maximum seats available
   */
  maxSeats: number;
  /**
   * Additional classes for container
   */
  className?: string;
}

/**
 * WaitingRoomHeader - Header section of the waiting room
 *
 * Displays:
 * - "MATCHMAKING" label and "Waiting Room" title
 * - Player count indicator (e.g., "1 / 20")
 * - Sound toggle button
 *
 * Mobile: Controls are under the title
 * Desktop: Controls are on the right side
 */
export function WaitingRoomHeader({ connectedPlayers, maxSeats, className }: WaitingRoomHeaderProps) {
  return (
    <motion.div className={cn("relative", className)} initial="hidden" animate="visible">
      {/* Desktop layout: side by side */}
      <div className="hidden md:flex items-start justify-between">
        {/* Left section: Title */}
        <div className="flex flex-col gap-2">
          {/* Matchmaking label */}
          <motion.p
            className="font-space text-xs font-normal leading-4 tracking-[1.2px] uppercase text-custom-vivid-orange"
            variants={labelVariants}
          >
            <FormattedMessage id="waiting_room.matchmaking" defaultMessage="Matchmaking" />
          </motion.p>
          {/* Main title */}
          <motion.div
            className="font-bricolage font-bold text-[100px] lg:text-[128px] leading-[0.94] text-black"
            variants={titleVariants}
          >
            <p>
              <FormattedMessage id="waiting_room.title" defaultMessage="Waiting Room" />
            </p>
          </motion.div>
        </div>

        {/* Right section: Player count */}
        <div className="flex gap-4 items-start">
          {/* Player count indicator */}
          <motion.div
            className="border-2 border-custom-vivid-orange flex items-center justify-center px-[18px] py-[10px] h-10"
            variants={playerCountVariants}
          >
            <p className="font-space text-xs font-normal leading-4 tracking-[1.2px] uppercase text-custom-vivid-orange whitespace-nowrap">
              {connectedPlayers} / {maxSeats}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mobile layout: stacked */}
      <div className="flex flex-col gap-3 md:hidden">
        {/* Matchmaking label */}
        <motion.p
          className="font-space text-[10px] font-normal leading-4 tracking-[2px] uppercase text-custom-vivid-orange"
          variants={labelVariants}
        >
          <FormattedMessage id="waiting_room.matchmaking" defaultMessage="Matchmaking" />
        </motion.p>

        {/* Main title */}
        <motion.div className="font-bricolage font-bold text-[60px] leading-[0.85] text-black" variants={titleVariants}>
          <p>
            <FormattedMessage id="waiting_room.title" defaultMessage="Waiting Room" />
          </p>
        </motion.div>

        {/* Controls row - under title on mobile */}
        <motion.div className="flex gap-2 items-center" variants={playerCountVariants}>
          {/* Player count indicator */}
          <div className="border-2 border-custom-vivid-orange flex items-center justify-center px-4 py-2 h-10">
            <p className="font-space text-xs font-normal leading-4 tracking-[1.2px] uppercase text-custom-vivid-orange whitespace-nowrap">
              {connectedPlayers} / {maxSeats}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
