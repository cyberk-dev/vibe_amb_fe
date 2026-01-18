"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { PlayerSeat } from "../model/types";

// ========================================
// Animation Variants
// ========================================

const seatBadgeVariants = {
  empty: { backgroundColor: "#e5e7eb" },
  occupied: {
    backgroundColor: "#000000",
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 20,
    },
  },
};

const playerInfoVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 150,
      damping: 15,
    },
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: { duration: 0.15 },
  },
};

const readyIndicatorVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 0.96,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 15,
      delay: 0.1,
    },
  },
};

const pulseAnimation = {
  scale: [1, 1.2, 1],
  opacity: [0.96, 1, 0.96],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

export interface PlayerSeatCardProps {
  seat: PlayerSeat;
  className?: string;
}

/**
 * PlayerSeatCard - Display a player seat with two states: occupied and waiting
 *
 * @example
 * // Occupied seat with ready player
 * <PlayerSeatCard
 *   seat={{
 *     seatNumber: 1,
 *     isOccupied: true,
 *     isReady: true,
 *     player: { name: "Manh", role: "PLAYER 1" }
 *   }}
 * />
 *
 * @example
 * // Empty waiting seat
 * <PlayerSeatCard
 *   seat={{
 *     seatNumber: 2,
 *     isOccupied: false
 *   }}
 * />
 */
export function PlayerSeatCard({ seat, className }: PlayerSeatCardProps) {
  const { seatNumber, isOccupied, isReady, player } = seat;

  return (
    <motion.div
      className={cn(
        "border-2 border-solid pb-0.5 pt-[26px] px-[26px] transition-colors duration-200",
        isOccupied ? "bg-white border-black" : "bg-[#f9fafb] border-[#d1d5dc]",
        className,
      )}
      layout
    >
      <div className="flex h-12 items-center justify-between">
        {/* Left section: Seat number + Player info */}
        <div className="flex gap-4 items-center">
          {/* Seat number badge */}
          <motion.div
            className="size-12 flex items-center justify-center shrink-0"
            variants={seatBadgeVariants}
            animate={isOccupied ? "occupied" : "empty"}
          >
            <p
              className={cn(
                "font-space text-[20px] font-bold leading-7 transition-colors duration-200",
                isOccupied ? "text-white" : "text-custom-light-grayish-blue",
              )}
            >
              {seatNumber}
            </p>
          </motion.div>

          {/* Player info or waiting text */}
          <div className="flex flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              {isOccupied && player ? (
                <motion.div
                  key="player-info"
                  variants={playerInfoVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {/* Player name */}
                  <p className="font-space text-[18px] font-bold leading-7 text-black">{player.name}</p>
                  {/* Player role */}
                  <p className="font-space text-[12px] font-normal leading-4 tracking-[0.6px] uppercase text-custom-dark-grayish-blue">
                    {player.role}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="waiting-info"
                  variants={playerInfoVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {/* Waiting text */}
                  <p className="font-space text-[18px] font-bold leading-7 text-custom-light-grayish-blue">
                    Waiting...
                  </p>
                  {/* Empty slot label */}
                  <p className="font-space text-[12px] font-normal leading-4 tracking-[0.6px] uppercase text-custom-light-grayish-blue">
                    Empty slot
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right section: Ready indicator (only for occupied seats) */}
        <AnimatePresence>
          {isOccupied && isReady && (
            <motion.div
              className="size-2 rounded-full bg-custom-ready-green shrink-0"
              variants={readyIndicatorVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              whileInView={pulseAnimation}
              aria-label="Player ready"
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
