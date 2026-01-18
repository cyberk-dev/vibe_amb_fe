"use client";

import { motion } from "framer-motion";
import { FormattedMessage } from "react-intl";
import { cn } from "@/shared/lib/utils";
import { PageHeader } from "@/shared/ui/page-header";
import { useIsMobile } from "@/hooks/use-mobile";
import { DecisionHeader } from "./decision-header";
import { EliminatedPlayerCard } from "./eliminated-player-card";
import { RemainingPlayersGrid } from "./remaining-players-grid";
import { DecisionCards } from "./decision-cards";
import { MobileDecisionLayout } from "./mobile-decision-layout";

// ========================================
// Animation Variants
// ========================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
    },
  },
};

const voteCardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
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
      delay: 0.6,
      duration: 0.4,
    },
  },
};

export interface DecisionPlayer {
  id: string;
  name: string;
  seatNumber: number;
  voteStatus?: "share" | "continue" | "pending";
}

export interface EliminatedPlayer {
  id: string;
  name: string;
  seatNumber: number;
  consolationPrize: number;
}

export interface VoteCounts {
  share: number;
  continue: number;
}

export interface DecisionWidgetProps {
  /** Total number of players remaining */
  totalPlayers: number;
  /** Player eliminated this round */
  eliminatedPlayer: EliminatedPlayer;
  /** Remaining active players */
  remainingPlayers: DecisionPlayer[];
  /** Prize per player if sharing */
  prizePerPlayer: string;
  /** Total prize pool */
  totalPool: string;
  /** Next round pool (if continuing) */
  nextRoundPool: number;
  /** Vote counts for each option */
  voteCounts: VoteCounts;
  /** Callback when Share Prize is clicked */
  onSharePrize: () => void;
  /** Callback when Continue Playing is clicked */
  onContinuePlaying: () => void;
  /** Whether voting is in progress */
  isVoting?: boolean;
  /** Current user's vote (if already voted) */
  currentUserVote?: "share" | "continue" | null;
  /** Additional classes */
  className?: string;
}

/**
 * DecisionWidget - Main decision/voting phase widget
 *
 * Displays:
 * - Header with "Decision" title and player count
 * - Eliminated player card with consolation prize
 * - Grid of remaining players with vote status
 * - Two decision cards: Share Prize vs Keep Playing
 *
 * Design based on Figma node 59:914 (desktop) and 66:1872 (mobile)
 */
export function DecisionWidget({
  totalPlayers,
  eliminatedPlayer,
  remainingPlayers,
  prizePerPlayer,
  totalPool,
  nextRoundPool,
  voteCounts,
  onSharePrize,
  onContinuePlaying,
  isVoting = false,
  currentUserVote = null,
  className,
}: DecisionWidgetProps) {
  const isMobile = useIsMobile();

  // Mobile layout
  if (isMobile) {
    return (
      <MobileDecisionLayout
        totalPlayers={totalPlayers}
        eliminatedPlayer={eliminatedPlayer}
        prizePerPlayer={prizePerPlayer}
        totalPool={totalPool}
        nextRoundPool={nextRoundPool}
        onSharePrize={onSharePrize}
        onContinuePlaying={onContinuePlaying}
        isVoting={isVoting}
        currentUserVote={currentUserVote}
        className={className}
      />
    );
  }

  // Desktop layout
  return (
    <div
      className={cn(
        "min-h-screen w-full overflow-auto",
        "bg-gradient-to-br from-[#fff7ed] via-white to-[#fef2f2]",
        className,
      )}
    >
      {/* Border frame - teal */}
      <motion.div
        className="relative border-8 border-custom-teal min-h-screen w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main content container with max-width and padding */}
        <div className="mx-auto max-w-[1440px] relative z-10 flex flex-col gap-12 min-h-screen px-4 py-8 md:px-16 md:py-12 pb-0">
          {/* Page header */}
          <div className="flex justify-end">
            <PageHeader variant="dark" />
          </div>

          {/* Header section */}
          <DecisionHeader totalPlayers={totalPlayers} />

          {/* Vote count cards */}
          <motion.div className="flex gap-4" variants={sectionVariants}>
            {/* Share votes card */}
            <motion.div
              className="flex items-center gap-3 border-2 border-custom-teal bg-custom-teal/10 px-6 py-3"
              variants={voteCardVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="size-10 bg-custom-teal flex items-center justify-center">
                <span className="font-space text-lg font-bold text-white">{voteCounts.share}</span>
              </div>
              <span className="font-space text-sm font-medium text-custom-teal uppercase tracking-wider">
                <FormattedMessage id="decision.widget.vote_share" />
              </span>
            </motion.div>

            {/* Continue votes card */}
            <motion.div
              className="flex items-center gap-3 border-2 border-custom-vivid-red bg-custom-vivid-red/10 px-6 py-3"
              variants={voteCardVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="size-10 bg-custom-vivid-red flex items-center justify-center">
                <span className="font-space text-lg font-bold text-white">{voteCounts.continue}</span>
              </div>
              <span className="font-space text-sm font-medium text-custom-vivid-red uppercase tracking-wider">
                <FormattedMessage id="decision.widget.vote_continue" />
              </span>
            </motion.div>
          </motion.div>

          {/* Eliminated player card */}
          <motion.div variants={sectionVariants}>
            <EliminatedPlayerCard player={eliminatedPlayer} />
          </motion.div>

          {/* Remaining players section */}
          <motion.div variants={sectionVariants}>
            <RemainingPlayersGrid players={remainingPlayers} />
          </motion.div>

          {/* Decision cards - flex-1 to push footer down */}
          <motion.div className="flex-1 flex flex-col" variants={sectionVariants}>
            <DecisionCards
              prizePerPlayer={prizePerPlayer}
              totalPool={totalPool}
              onSharePrize={onSharePrize}
              onContinuePlaying={onContinuePlaying}
              isVoting={isVoting}
              currentUserVote={currentUserVote}
            />
          </motion.div>

          {/* Footer */}
          <motion.div className="border-t-2 border-black/10 py-8" variants={footerVariants}>
            <p className="font-space text-xs uppercase tracking-[1.6px] text-black/40">
              <FormattedMessage id="decision.widget.footer" />
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
