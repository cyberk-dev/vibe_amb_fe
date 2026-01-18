"use client";

import { motion } from "framer-motion";
import { FormattedMessage } from "react-intl";
import { cn } from "@/shared/lib/utils";
import { SoundButton } from "@/shared/ui/sound-button";
import type { EliminatedPlayer } from "./decision-widget";

// ========================================
// Animation Variants
// ========================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const headerVariants = {
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
  hidden: { opacity: 0, x: -50, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
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

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
      delay: 0.4,
    },
  },
};

interface MobileDecisionLayoutProps {
  totalPlayers: number;
  eliminatedPlayer: EliminatedPlayer;
  prizePerPlayer: number;
  totalPool: number;
  nextRoundPool: number;
  onSharePrize: () => void;
  onContinuePlaying: () => void;
  isVoting?: boolean;
  currentUserVote?: "share" | "continue" | null;
  className?: string;
}

/**
 * MobileDecisionLayout - Mobile-specific decision screen layout
 *
 * Based on Figma node 66:1872
 */
export function MobileDecisionLayout({
  totalPlayers,
  eliminatedPlayer,
  prizePerPlayer,
  totalPool,
  nextRoundPool,
  onSharePrize,
  onContinuePlaying,
  isVoting = false,
  currentUserVote = null,
  className,
}: MobileDecisionLayoutProps) {
  const hasVotedShare = currentUserVote === "share";
  const hasVotedContinue = currentUserVote === "continue";

  return (
    <div
      className={cn(
        "h-full w-full overflow-auto",
        "bg-gradient-to-br from-[#fff7ed] via-white to-[#fef2f2]",
        className,
      )}
    >
      {/* Border frame - teal, thinner on mobile */}
      <div className="relative border-[3.5px] border-custom-teal min-h-full w-full">
        {/* Main content */}
        <motion.div className="flex flex-col gap-6 p-5" variants={containerVariants} initial="hidden" animate="visible">
          {/* Header */}
          <motion.div className="flex flex-col gap-3" variants={headerVariants}>
            <motion.p
              className="font-space text-[10px] font-normal uppercase tracking-[2px] text-custom-teal"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring" as const, stiffness: 100, damping: 15 }}
            >
              <FormattedMessage id="decision.header.critical_choice" />
            </motion.p>
            <motion.h1
              className="font-bricolage text-[60px] font-bold leading-[0.85] text-black"
              variants={titleVariants}
            >
              <FormattedMessage id="decision.header.title" />
            </motion.h1>

            {/* Controls row */}
            <motion.div
              className="flex items-center gap-3 mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring" as const, stiffness: 100, damping: 15, delay: 0.2 }}
            >
              <motion.div
                className="h-9 border-[1.8px] border-custom-teal px-4 flex items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring" as const, stiffness: 120, damping: 15, delay: 0.25 }}
              >
                <span className="font-space text-xs font-medium text-custom-teal">
                  <FormattedMessage id="decision.header.players" values={{ count: totalPlayers }} />
                </span>
              </motion.div>
              <SoundButton variant="dark" />
            </motion.div>
          </motion.div>

          {/* Prize Pool Card */}
          <motion.div
            className="bg-white border-[1.8px] border-custom-teal p-4 flex flex-col gap-4"
            variants={cardVariants}
          >
            <p className="font-space text-[10px] font-normal uppercase tracking-[2px] text-custom-teal">
              <FormattedMessage id="decision.mobile.current_prize_pool" />
            </p>

            <div className="flex flex-col gap-2">
              <motion.p
                className="font-bricolage text-5xl font-bold text-black"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring" as const, stiffness: 100, damping: 15, delay: 0.2 }}
              >
                ${totalPool.toFixed(2)}
              </motion.p>
              <p className="font-space text-xs font-normal uppercase tracking-[0.3px] text-black/60">
                <FormattedMessage id="decision.header.players_remaining" values={{ count: totalPlayers }} />
              </p>
            </div>

            {/* Divider and stats */}
            <div className="border-t border-black/10 pt-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="font-space text-[10px] font-normal uppercase tracking-[0.25px] text-black/60">
                  <FormattedMessage id="decision.mobile.if_shared_now" />
                </p>
                <p className="font-space text-sm font-bold text-black">
                  ${prizePerPlayer.toFixed(2)} <FormattedMessage id="decision.mobile.each" />
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-space text-[10px] font-normal uppercase tracking-[0.25px] text-black/60">
                  <FormattedMessage id="decision.mobile.next_round_pool" />
                </p>
                <p className="font-space text-sm font-bold text-custom-teal">${nextRoundPool.toFixed(2)}</p>
              </div>
            </div>
          </motion.div>

          {/* Eliminated section */}
          <motion.div className="flex flex-col gap-3" variants={cardVariants}>
            <p className="font-space text-[10px] font-normal uppercase tracking-[2px] text-black/40">
              <FormattedMessage id="decision.eliminated.eliminated_count" values={{ count: 1 }} />
            </p>
            <motion.div
              className="bg-white/50 border border-black/10 px-2 py-2 flex items-center gap-2 w-fit"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring" as const, stiffness: 100, damping: 15, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="size-6 bg-black/10 flex items-center justify-center">
                <span className="font-space text-[10px] font-bold text-black/30">✕</span>
              </div>
              <span className="font-space text-[10px] font-medium text-black/50">{eliminatedPlayer.name}</span>
            </motion.div>
          </motion.div>

          {/* Make Your Choice section */}
          <motion.div className="flex flex-col gap-3" variants={cardVariants}>
            <p className="font-space text-[10px] font-normal uppercase tracking-[2px] text-black/40">
              <FormattedMessage id="decision.mobile.make_your_choice" />
            </p>

            {/* Share Now button */}
            <motion.button
              type="button"
              onClick={onSharePrize}
              disabled={isVoting || hasVotedShare}
              className={cn(
                "w-full p-6 text-left cursor-pointer",
                "bg-custom-teal border-[1.8px] border-custom-teal",
                "disabled:opacity-70 disabled:cursor-not-allowed",
              )}
              variants={buttonVariants}
              whileHover={!isVoting && !hasVotedShare ? { scale: 1.02 } : undefined}
              whileTap={!isVoting && !hasVotedShare ? { scale: 0.98 } : undefined}
            >
              <div className="flex flex-col gap-3">
                <h2 className="font-bricolage text-[30px] font-bold leading-[1.2] text-white">
                  <FormattedMessage id="decision.cards.share_now_line1" />
                  <br />
                  <FormattedMessage id="decision.cards.share_now_line2" />
                </h2>
                <p className="font-space text-xs font-normal uppercase tracking-[0.3px] text-white/80">
                  {hasVotedShare ? (
                    <FormattedMessage id="decision.cards.you_voted_share" />
                  ) : (
                    <FormattedMessage id="decision.cards.split_equally" values={{ amount: totalPool.toFixed(2) }} />
                  )}
                </p>
              </div>
            </motion.button>

            {/* Keep Going button */}
            <motion.button
              type="button"
              onClick={onContinuePlaying}
              disabled={isVoting || hasVotedContinue}
              className={cn(
                "w-full p-6 text-left cursor-pointer",
                "bg-custom-vivid-red border-[1.8px] border-custom-vivid-red",
                "disabled:opacity-70 disabled:cursor-not-allowed",
              )}
              variants={buttonVariants}
              whileHover={!isVoting && !hasVotedContinue ? { scale: 1.02 } : undefined}
              whileTap={!isVoting && !hasVotedContinue ? { scale: 0.98 } : undefined}
            >
              <div className="flex flex-col gap-3">
                <h2 className="font-bricolage text-[30px] font-bold leading-[1.2] text-white">
                  <FormattedMessage id="decision.cards.keep_going_line1" />
                  <br />
                  <FormattedMessage id="decision.cards.keep_going_line2" />
                </h2>
                <p className="font-space text-xs font-normal uppercase tracking-[0.3px] text-white/80">
                  {hasVotedContinue ? (
                    <FormattedMessage id="decision.cards.you_voted_continue" />
                  ) : (
                    <FormattedMessage id="decision.cards.risk_for" values={{ amount: nextRoundPool.toFixed(2) }} />
                  )}
                </p>
              </div>
            </motion.button>
          </motion.div>

          {/* Footer */}
          <motion.div className="border-t border-black/10 pt-6" variants={footerVariants}>
            <p className="font-space text-[10px] font-normal uppercase tracking-[1.5px] text-black/40 text-center">
              <FormattedMessage id="decision.widget.footer" />
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
