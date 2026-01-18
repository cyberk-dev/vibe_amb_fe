"use client";

import { motion } from "framer-motion";
import { FormattedMessage } from "react-intl";
import { cn } from "@/shared/lib/utils";
import { AnimatedDigits } from "@/shared/ui";

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

const subtitleVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      delay: 0.2,
    },
  },
};

const rightSectionVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
      delay: 0.2,
    },
  },
};

interface PassGameHeaderProps {
  /**
   * Current round number
   */
  round: number;
  /**
   * Countdown timer value in seconds
   */
  countdown: number;
  /**
   * Additional classes for container
   */
  className?: string;
}

/**
 * PassGameHeader - Header section of the pass game screen
 *
 * Displays:
 * - "GAME IN PROGRESS" label
 * - "Pass" title with countdown
 * - "Your turn to pass" subtitle
 * - Round indicator and sound toggle (right side)
 */
export function PassGameHeader({ round, countdown, className }: PassGameHeaderProps) {
  return (
    <motion.div className={cn("flex items-start justify-between", className)} initial="hidden" animate="visible">
      {/* Left section: Title */}
      <div className="flex flex-col gap-2">
        {/* Game in progress label */}
        <motion.p
          className="font-space text-xs font-normal leading-4 tracking-[1.2px] uppercase text-[#e7000b]"
          variants={labelVariants}
        >
          <FormattedMessage id="pass_game.game_in_progress" defaultMessage="Game In Progress" />
        </motion.p>

        {/* Main title: Pass + Countdown */}
        <motion.div className="flex items-baseline gap-4 md:gap-8" variants={titleVariants}>
          <span className="font-bricolage font-bold text-[56px] md:text-[80px] lg:text-[128px] xl:text-[160px] leading-[0.85] text-[#e7000b]">
            <FormattedMessage id="pass_game.pass" defaultMessage="Pass" />
          </span>
          <AnimatedDigits
            value={countdown}
            minDigits={2}
            className="font-bricolage font-light text-[40px] md:text-[60px] lg:text-[80px] xl:text-[104px] leading-[0.85] text-black"
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="font-space text-sm font-normal leading-5 tracking-[0.7px] uppercase text-[#4a5565]"
          variants={subtitleVariants}
        >
          <FormattedMessage id="pass_game.your_turn_to_pass" defaultMessage="Your turn to pass" />
        </motion.p>
      </div>

      {/* Right section: Round indicator */}
      <motion.div className="flex gap-2.5 items-center" variants={rightSectionVariants}>
        {/* Round indicator */}
        <motion.div
          className="border-2 border-[#e7000b] flex items-center justify-center px-[12px] py-[6px] lg:px-[18px] lg:py-[10px] h-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring" as const, stiffness: 120, damping: 15, delay: 0.3 }}
        >
          <p className="font-space text-xs font-normal leading-4 tracking-[1.2px] uppercase text-[#e7000b] whitespace-nowrap">
            <FormattedMessage id="pass_game.round" defaultMessage="Round {number}" values={{ number: round }} />
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
