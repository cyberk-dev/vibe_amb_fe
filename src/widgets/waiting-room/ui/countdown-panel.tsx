"use client";

import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { FormattedMessage } from "react-intl";
import { AnimatedDigits } from "@/shared/ui/animated-digits";

// ========================================
// Animation Variants
// ========================================

const countdownVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 12,
      delay: 0.2,
    },
  },
};

const statusBarVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      delay: 0.4,
    },
  },
};

interface CountdownPanelProps {
  /**
   * Countdown value in seconds
   */
  countdown: number;
  /**
   * Whether the countdown is active (all seats full)
   */
  isActive: boolean;
  /**
   * Additional classes for container
   */
  className?: string;
}

/**
 * CountdownPanel - Right side panel showing countdown timer
 *
 * Shows:
 * - Large countdown number (e.g., "60")
 * - "Game will start soon" button/indicator when countdown is active
 *
 * Mobile: Horizontal layout at bottom
 * Desktop: Vertical layout on right side
 */
export function CountdownPanel({ countdown, isActive, className }: CountdownPanelProps) {
  return (
    <motion.div
      className={cn("flex flex-col items-center", "lg:justify-between lg:h-full", className)}
      initial="hidden"
      animate="visible"
    >
      {/* Countdown number */}
      <motion.div className="flex items-center justify-center py-4 lg:py-0 lg:flex-1" variants={countdownVariants}>
        <AnimatedDigits
          value={countdown}
          minDigits={2}
          className={cn(
            "font-space font-light text-[64px] md:text-[100px] lg:text-[128px] text-center tracking-[0.7px] uppercase transition-colors duration-300",
            isActive ? "text-black" : "text-gray-300",
          )}
        />
      </motion.div>

      {/* Game start button/indicator */}
      <motion.div
        className={cn(
          "w-full bg-black h-[50px] md:h-[60px] flex items-center justify-center transition-opacity duration-300",
          isActive ? "opacity-100" : "opacity-50",
        )}
        variants={statusBarVariants}
        whileHover={isActive ? { scale: 1.02 } : undefined}
      >
        <p className="font-space font-bold text-xs md:text-sm leading-5 text-center text-white tracking-[0.7px] uppercase">
          {isActive ? (
            <FormattedMessage id="waiting_room.status.starting_soon" defaultMessage="Game will start soon" />
          ) : (
            <FormattedMessage id="waiting_room.status.waiting" defaultMessage="Waiting for players..." />
          )}
        </p>
      </motion.div>
    </motion.div>
  );
}
