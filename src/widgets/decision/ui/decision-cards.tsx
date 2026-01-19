"use client";

import { motion } from "framer-motion";
import { FormattedMessage } from "react-intl";
import { cn } from "@/shared/lib/utils";
import { useHoverSound } from "@/shared/lib";

// ========================================
// Animation Variants
// ========================================

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
    },
  },
};

const prizeBoxVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      delay: 0.2,
    },
  },
};

interface DecisionCardsProps {
  prizePerPlayer: string;
  totalPool: string;
  onSharePrize: () => void;
  onContinuePlaying: () => void;
  isVoting?: boolean;
  currentUserVote?: "share" | "continue" | null;
  className?: string;
}

/**
 * DecisionCards - Two option cards for voting
 *
 * Option A: Share Prize (teal theme)
 * - End game and split equally
 * - Shows prize per player
 *
 * Option B: Keep Playing (orange/red theme)
 * - Continue to eliminate more players
 * - Shows total pool
 */
export function DecisionCards({
  prizePerPlayer,
  totalPool,
  onSharePrize,
  onContinuePlaying,
  isVoting = false,
  currentUserVote = null,
  className,
}: DecisionCardsProps) {
  const hasVotedShare = currentUserVote === "share";
  const hasVotedContinue = currentUserVote === "continue";
  const hasVoted = currentUserVote !== null;
  const { onMouseEnter: playHoverSound } = useHoverSound();

  return (
    <motion.div
      className={cn("grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1", className)}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.15, delayChildren: 0.1 },
        },
      }}
    >
      {/* Option A - Share Prize */}
      <motion.div
        className={cn(
          "bg-white border-4 border-custom-teal",
          "flex flex-col justify-between",
          "p-8 md:pt-[52px] md:px-[52px] md:pb-0",
        )}
        variants={cardVariants}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex flex-col gap-6">
          {/* Option label */}
          <motion.div
            className="border-2 border-custom-teal w-fit px-4 py-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="font-space text-xs font-normal uppercase tracking-[2.4px] text-custom-teal">
              <FormattedMessage id="decision.cards.option_a" />
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="font-bricolage text-5xl md:text-7xl font-bold leading-[1] text-custom-teal">
            <FormattedMessage id="decision.cards.share_prize_line1" />
            <br />
            <FormattedMessage id="decision.cards.share_prize_line2" />
          </h2>

          {/* Description */}
          <p className="font-space text-sm font-normal uppercase tracking-[0.7px] text-black/60">
            <FormattedMessage id="decision.cards.share_description" />
          </p>

          {/* Prize box */}
          <motion.div
            className="bg-custom-teal/5 border-2 border-custom-teal p-8 flex flex-col items-center gap-2"
            variants={prizeBoxVariants}
          >
            <span className="font-bricolage text-5xl md:text-6xl font-bold text-custom-teal">${prizePerPlayer}</span>
            <span className="font-space text-xs font-normal uppercase tracking-[0.6px] text-custom-teal">
              <FormattedMessage id="decision.cards.per_player" />
            </span>
          </motion.div>
        </div>

        {/* Action button - sticks to bottom on desktop */}
        <motion.button
          type="button"
          onClick={onSharePrize}
          onMouseEnter={playHoverSound}
          disabled={isVoting || hasVoted}
          className={cn(
            "w-full h-[60px] mt-8 md:mt-auto cursor-pointer",
            "bg-custom-teal text-white",
            "font-space text-sm font-bold uppercase tracking-[2.8px]",
            "hover:opacity-90 transition-opacity",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
          whileHover={!isVoting && !hasVoted ? { scale: 1.02 } : undefined}
          whileTap={!isVoting && !hasVoted ? { scale: 0.98 } : undefined}
        >
          {hasVotedShare ? (
            <FormattedMessage id="decision.cards.voted" />
          ) : (
            <FormattedMessage id="decision.cards.share_prize" />
          )}
        </motion.button>
      </motion.div>

      {/* Option B - Keep Playing */}
      <motion.div
        className={cn(
          "bg-custom-vivid-red border-4 border-custom-vivid-red",
          "flex flex-col justify-between",
          "p-8 md:pt-[52px] md:px-[52px] md:pb-0",
        )}
        variants={cardVariants}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex flex-col gap-6">
          {/* Option label */}
          <motion.div
            className="border-2 border-white/40 w-fit px-4 py-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="font-space text-xs font-normal uppercase tracking-[2.4px] text-white/90">
              <FormattedMessage id="decision.cards.option_b" />
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="font-bricolage text-5xl md:text-7xl font-bold leading-[1] text-white">
            <FormattedMessage id="decision.cards.keep_playing_line1" />
            <br />
            <FormattedMessage id="decision.cards.keep_playing_line2" />
          </h2>

          {/* Description */}
          <p className="font-space text-sm font-normal uppercase tracking-[0.7px] text-white/80">
            <FormattedMessage id="decision.cards.continue_description" />
          </p>

          {/* Prize box */}
          <motion.div
            className="bg-white/10 border-2 border-white/40 p-8 flex flex-col items-center gap-2"
            variants={prizeBoxVariants}
          >
            <span className="font-bricolage text-5xl md:text-6xl font-bold text-white">${totalPool}</span>
            <span className="font-space text-xs font-normal uppercase tracking-[0.6px] text-white/80">
              <FormattedMessage id="decision.cards.total_pool" />
            </span>
          </motion.div>
        </div>

        {/* Action button - sticks to bottom on desktop */}
        <motion.button
          type="button"
          onClick={onContinuePlaying}
          onMouseEnter={playHoverSound}
          disabled={isVoting || hasVoted}
          className={cn(
            "w-full h-[60px] mt-8 md:mt-auto cursor-pointer",
            "bg-black text-white",
            "font-space text-sm font-bold uppercase tracking-[2.8px]",
            "hover:opacity-90 transition-opacity",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
          whileHover={!isVoting && !hasVoted ? { scale: 1.02 } : undefined}
          whileTap={!isVoting && !hasVoted ? { scale: 0.98 } : undefined}
        >
          {hasVotedContinue ? (
            <FormattedMessage id="decision.cards.voted" />
          ) : (
            <FormattedMessage id="decision.cards.continue_playing" />
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
