"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useIntl, FormattedMessage } from "react-intl";
import { cn } from "@/shared/lib/utils";
import type { GameHost, RevealPackData } from "@/entities/game";
import { RevealPackCard, GameHostBadge } from "@/entities/game";

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

/** Default host configuration */
const DEFAULT_HOST: GameHost = {
  name: "Mr. Horse",
  role: "Admin",
  avatarUrl: "https://www.figma.com/api/mcp/asset/96329116-3447-40bf-86b3-3ca73059ad0d",
  message: "haha guess who's dead",
};

/** Default pack image URL */
const DEFAULT_PACK_IMAGE = "https://www.figma.com/api/mcp/asset/9e74a999-5721-456a-b409-f8c118cc68ef";

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

/**
 * RevealScreen - Screen for the reveal phase of the game
 *
 * Features:
 * - Grid of player packs that reveal one by one
 * - Header with title, reveal count, sound toggle, and host badge
 * - Three pack states: pending, revealed-safe, revealed-exploded
 * - Footer showing "Proceeding to next phase..." when all revealed
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
  const [isMuted, setIsMuted] = useState(false);
  const revealIndexRef = useRef(0);
  const revealIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const intl = useIntl();

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

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return (
    <div className="h-screen w-full bg-white overflow-hidden">
      {/* Main container with red border frame */}
      <div
        className="h-full border-8 border-destructive flex flex-col gap-5 p-8 md:p-12"
        style={{
          background:
            "linear-gradient(134.72deg, rgba(255, 247, 237, 1) 0%, rgba(255, 255, 255, 1) 50%, rgba(254, 242, 242, 1) 100%)",
        }}
      >
        {/* Header section */}
        <RevealHeader
          revealedCount={revealedCount}
          totalCount={totalCount}
          host={DEFAULT_HOST}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />

        {/* Pack grid section */}
        <RevealPackGrid packs={packs} />

        {/* Footer section */}
        {allRevealed && <RevealFooter />}
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
  host: GameHost;
  isMuted: boolean;
  onToggleMute: () => void;
}

function RevealHeader({ revealedCount, totalCount, host, isMuted, onToggleMute }: RevealHeaderProps) {
  const intl = useIntl();

  return (
    <div className="flex items-start justify-between w-full">
      {/* Left: Title section */}
      <div className="flex flex-col gap-4">
        {/* "Moment of Truth" label */}
        <p className="font-space text-xs font-normal leading-4 tracking-[3.6px] uppercase text-destructive">
          <FormattedMessage id="reveal_game.moment_of_truth" defaultMessage="Moment of Truth" />
        </p>

        {/* "Reveal" title */}
        <h1 className="font-bricolage font-bold text-[96px] md:text-[160px] lg:text-[104px] leading-[0.85] text-black">
          <FormattedMessage id="reveal_game.reveal" defaultMessage="Reveal" />
        </h1>
      </div>

      {/* Right: Controls + Host badge */}
      <div className="flex flex-col items-end gap-5">
        {/* Top row: Reveal count + Sound toggle */}
        <div className="flex gap-4 items-center">
          {/* Reveal count indicator */}
          <div className="border-2 border-destructive flex items-center justify-center px-[26px] py-[14px] h-12">
            <p className="font-space text-sm font-medium leading-5 text-destructive">
              {revealedCount} / {totalCount}
            </p>
          </div>

          {/* Sound toggle button */}
          <button
            type="button"
            onClick={onToggleMute}
            className="bg-custom-light-orange size-12 flex items-center justify-center"
            aria-label={
              isMuted
                ? intl.formatMessage({
                    id: "waiting_room.aria.unmute",
                    defaultMessage: "Unmute sound",
                  })
                : intl.formatMessage({
                    id: "waiting_room.aria.mute",
                    defaultMessage: "Mute sound",
                  })
            }
          >
            {isMuted ? <VolumeX className="size-6 text-white" /> : <Volume2 className="size-6 text-white" />}
          </button>
        </div>

        {/* Host badge with speech bubble */}
        <GameHostBadge host={host} />
      </div>
    </div>
  );
}

interface RevealPackGridProps {
  packs: RevealPackData[];
}

function RevealPackGrid({ packs }: RevealPackGridProps) {
  return (
    <div className="flex flex-col gap-6 flex-1 min-h-0">
      {/* Section label */}
      <p className="font-space text-xs font-normal leading-4 tracking-[3.6px] uppercase text-black/40 shrink-0">
        <FormattedMessage id="reveal_game.revealing_packets" defaultMessage="Revealing Packets" />
      </p>

      {/* Pack grid - scrollable container */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="flex flex-wrap gap-[30px] pb-4">
          {packs.map((pack) => (
            <RevealPackCard key={pack.id} pack={pack} size="md" />
          ))}
        </div>
      </div>
    </div>
  );
}

function RevealFooter() {
  return (
    <div className="border-t-2 border-black/10 pt-8">
      <p className="font-space text-xs font-normal leading-4 tracking-[2.4px] uppercase text-black/40">
        <FormattedMessage id="reveal_game.proceeding_to_next_phase" defaultMessage="→ Proceeding to next phase..." />
      </p>
    </div>
  );
}
