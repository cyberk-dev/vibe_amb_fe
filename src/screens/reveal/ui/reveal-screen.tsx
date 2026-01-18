"use client";

import { motion } from "framer-motion";
import { FormattedMessage } from "react-intl";
import { PageHeader } from "@/shared/ui/page-header";
import { FullScreenLoader } from "@/shared/ui/full-screen-loader";
import type { RevealPackData } from "@/entities/game";
import { RevealPackCard } from "@/entities/game";
import { useRevealFlow } from "../lib/use-reveal-flow";

// ============================================================================
// Animation Variants
// ============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

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

const gridContainerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
      delay: 0.3,
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
      stiffness: 100,
      damping: 15,
    },
  },
};

/**
 * RevealScreen - Screen for the reveal phase of the game
 *
 * Features:
 * - Grid of player packs showing reveal results
 * - Header with title and reveal count
 * - Three pack states: pending, revealed-safe, revealed-exploded
 * - Footer showing "Proceeding to next phase..." when all revealed
 * - Full page animations with Framer Motion
 *
 * Flow:
 * - Fetches survivors from get_all_players()
 * - Fetches victim addresses from get_round_victims()
 * - Fetches victim names from get_player_info()
 * - Displays all packs with their reveal state
 * - GameFlowGuard handles phase transitions
 */
export function RevealScreen() {
  const { packs, isLoading } = useRevealFlow();

  // Show loading state
  if (isLoading) {
    return <FullScreenLoader />;
  }

  const revealedCount = packs.length;
  const totalCount = packs.length;
  const allRevealed = true; // All are revealed at once in contract

  return (
    <div
      className="min-h-screen w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(134.72deg, rgba(255, 247, 237, 1) 0%, rgba(255, 255, 255, 1) 50%, rgba(254, 242, 242, 1) 100%)",
      }}
    >
      {/* Main container with red border frame */}
      <div className="min-h-screen border-8 border-destructive">
        {/* Content with max-width */}
        <motion.div
          className="mx-auto max-w-[1440px] flex flex-col gap-5 px-4 py-8 md:px-16 md:py-12 min-h-screen"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Page header */}
          <div className="flex justify-end">
            <PageHeader variant="dark" />
          </div>

          {/* Header section */}
          <RevealHeader revealedCount={revealedCount} totalCount={totalCount} />

          {/* Pack grid section */}
          <RevealPackGrid packs={packs} />

          {/* Footer section */}
          {allRevealed && <RevealFooter />}
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

interface RevealHeaderProps {
  revealedCount: number;
  totalCount: number;
}

function RevealHeader({ revealedCount, totalCount }: RevealHeaderProps) {
  return (
    <motion.div className="flex items-start justify-between w-full" initial="hidden" animate="visible">
      {/* Left: Title section */}
      <div className="flex flex-col gap-4">
        {/* "Moment of Truth" label */}
        <motion.p
          className="font-space text-xs font-normal leading-4 tracking-[3.6px] uppercase text-destructive"
          variants={labelVariants}
        >
          <FormattedMessage id="reveal_game.moment_of_truth" defaultMessage="Moment of Truth" />
        </motion.p>

        {/* "Reveal" title */}
        <motion.h1
          className="font-bricolage font-bold text-[96px] md:text-[160px] lg:text-[104px] leading-[0.85] text-black"
          variants={titleVariants}
        >
          <FormattedMessage id="reveal_game.reveal" defaultMessage="Reveal" />
        </motion.h1>
      </div>

      {/* Right: Reveal count indicator */}
      <motion.div className="flex gap-4 items-center" variants={rightSectionVariants}>
        <motion.div
          className="border-2 border-destructive flex items-center justify-center px-[26px] py-[14px] h-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring" as const, stiffness: 120, damping: 15, delay: 0.3 }}
        >
          <p className="font-space text-sm font-medium leading-5 text-destructive">
            {revealedCount} / {totalCount}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

interface RevealPackGridProps {
  packs: RevealPackData[];
}

function RevealPackGrid({ packs }: RevealPackGridProps) {
  return (
    <motion.div className="flex flex-col gap-6 flex-1 min-h-0" variants={gridContainerVariants}>
      {/* Section label */}
      <p className="font-space text-xs font-normal leading-4 tracking-[3.6px] uppercase text-black/40 shrink-0">
        <FormattedMessage id="reveal_game.revealing_packets" defaultMessage="Revealing Packets" />
      </p>

      {/* Pack grid - scrollable container */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div
          className="grid gap-[30px] pb-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          }}
        >
          {packs.map((pack) => (
            <RevealPackCard key={pack.id} pack={pack} size="md" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function RevealFooter() {
  return (
    <motion.div
      className="border-t-2 border-black/10 pt-8"
      variants={footerVariants}
      initial="hidden"
      animate="visible"
    >
      <p className="font-space text-xs font-normal leading-4 tracking-[2.4px] uppercase text-black/40">
        <FormattedMessage id="reveal_game.proceeding_to_next_phase" defaultMessage="→ Proceeding to next phase..." />
      </p>
    </motion.div>
  );
}
