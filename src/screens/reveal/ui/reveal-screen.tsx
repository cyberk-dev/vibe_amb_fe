"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FormattedMessage } from "react-intl";
import { PageHeader } from "@/shared/ui/page-header";
import type { RevealPackData } from "@/entities/game";
import { RevealPackCard } from "@/entities/game";

/** Constants for the reveal phase */
const REVEAL_INTERVAL_MS = 800;
const TOTAL_PLAYERS = 20;

/** Fake player names for simulation */
const FAKE_PLAYER_NAMES = [
  "Manh",
  "Alice",
  "Bob",
  "Charlie",
  "Diana",
  "Eve",
  "Frank",
  "Grace",
  "Henry",
  "Ivy",
  "Jack",
  "Kate",
  "Leo",
  "Maya",
  "Noah",
  "Olivia",
  "Peter",
  "Quinn",
  "Rose",
  "Sam",
];

/** Default pack image URL */
const DEFAULT_PACK_IMAGE = "/packet.png";

/**
 * Generate initial mock packs for all players
 */
function generateInitialPacks(): RevealPackData[] {
  return FAKE_PLAYER_NAMES.slice(0, TOTAL_PLAYERS).map((name, index) => ({
    id: `pack-${index + 1}`,
    player: {
      id: `player-${index + 1}`,
      name,
      seatNumber: index + 1,
    },
    revealState: "pending" as const,
  }));
}

/**
 * Simulate reveal result for a pack
 * Note: Replace with actual on-chain result when API is ready
 */
function simulateRevealResult(pack: RevealPackData, isExploded: boolean): RevealPackData {
  if (isExploded) {
    return {
      ...pack,
      revealState: "revealed-exploded",
      consolationPrize: "+$1",
      trolledBy: "Anderson",
    };
  }
  return {
    ...pack,
    revealState: "revealed-safe",
    packNumber: Math.floor(Math.random() * 9) + 1,
    imageUrl: DEFAULT_PACK_IMAGE,
  };
}

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
 * - Grid of player packs that reveal one by one
 * - Header with title and reveal count
 * - Three pack states: pending, revealed-safe, revealed-exploded
 * - Footer showing "Proceeding to next phase..." when all revealed
 * - Full page animations with Framer Motion
 *
 * Flow:
 * - Packs start in "pending" state
 * - One by one, packs reveal their content
 * - Exploded packs show BOOM! with consolation prize
 * - Safe packs show pack illustration with number
 * - When all revealed, proceed to next phase
 *
 * Note: This screen uses fake data. Replace with actual game state
 * from contract/backend when API is ready.
 */
export function RevealScreen() {
  // Game state
  const [packs, setPacks] = useState<RevealPackData[]>(generateInitialPacks);
  const revealIndexRef = useRef(0);
  const revealIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate revealed count
  const revealedCount = packs.filter((p) => p.revealState !== "pending").length;
  const totalCount = packs.length;
  const allRevealed = revealedCount === totalCount;

  // Auto-reveal packs one by one
  useEffect(() => {
    revealIntervalRef.current = setInterval(() => {
      const currentIndex = revealIndexRef.current;
      if (currentIndex >= TOTAL_PLAYERS) {
        if (revealIntervalRef.current) {
          clearInterval(revealIntervalRef.current);
        }
        return;
      }

      // Simulate: every 5th pack explodes (for demo)
      const isExploded = (currentIndex + 1) % 5 === 3; // Pack 3, 8, 13, 18 explode

      setPacks((prev) => {
        const newPacks = [...prev];
        newPacks[currentIndex] = simulateRevealResult(newPacks[currentIndex], isExploded);
        return newPacks;
      });

      revealIndexRef.current += 1;
    }, REVEAL_INTERVAL_MS);

    return () => {
      if (revealIntervalRef.current) {
        clearInterval(revealIntervalRef.current);
      }
    };
  }, []);

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
