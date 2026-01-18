"use client";

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

const controlsVariants = {
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

interface DecisionHeaderProps {
  totalPlayers: number;
  className?: string;
}

/**
 * DecisionHeader - Header section with title and controls
 *
 * Shows:
 * - "CRITICAL DECISION" label
 * - "Decision" large title
 * - Player count badge
 * - Sound toggle button
 */
export function DecisionHeader({ totalPlayers, className }: DecisionHeaderProps) {
  return (
    <motion.div className={cn("flex items-start justify-between", className)} initial="hidden" animate="visible">
      {/* Left side - Title */}
      <div className="flex flex-col gap-4">
        <motion.p
          className="font-space text-xs font-normal uppercase tracking-[3.6px] text-custom-teal"
          variants={labelVariants}
        >
          <FormattedMessage id="decision.header.critical_decision" />
        </motion.p>
        <motion.h1
          className="font-bricolage text-[80px] md:text-[192px] font-bold leading-[0.85] text-black"
          variants={titleVariants}
        >
          <FormattedMessage id="decision.header.title" />
        </motion.h1>
      </div>

      {/* Right side - Controls */}
      <motion.div className="flex items-center gap-4" variants={controlsVariants}>
        {/* Player count badge */}
        <motion.div
          className="h-12 border-2 border-custom-teal px-6 flex items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring" as const, stiffness: 120, damping: 15, delay: 0.3 }}
        >
          <span className="font-space text-sm font-medium text-custom-teal">
            <FormattedMessage id="decision.header.players" values={{ count: totalPlayers }} />
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
