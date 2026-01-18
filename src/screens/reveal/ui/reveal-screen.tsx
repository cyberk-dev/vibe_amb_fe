"use client";

import { useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useIntl, FormattedMessage } from "react-intl";
import type { GameHost, RevealPackData } from "@/entities/game";
import { RevealPackCard, GameHostBadge } from "@/entities/game";
import { useRevealFlow } from "../lib/use-reveal-flow";

/** Default host configuration */
const DEFAULT_HOST: GameHost = {
  name: "Mr. Horse",
  role: "Admin",
  avatarUrl: "https://www.figma.com/api/mcp/asset/96329116-3447-40bf-86b3-3ca73059ad0d",
  message: "haha guess who's dead",
};

/**
 * RevealScreen - Screen for the reveal phase of the game
 *
 * Features:
 * - Grid of player packs showing reveal results
 * - Header with title, reveal count, sound toggle, and host badge
 * - Pack states: revealed-safe, revealed-exploded
 * - Footer showing "Proceeding to next phase..." when all revealed
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
  const [isMuted, setIsMuted] = useState(false);

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#fff7ed]">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-[#f54900] text-lg font-space">Loading...</p>
        </div>
      </div>
    );
  }

  const revealedCount = packs.length;
  const totalCount = packs.length;
  const allRevealed = true; // All are revealed at once in contract

  return (
    <div className="h-screen w-full bg-white overflow-hidden">
      {/* Main container with red border frame */}
      <div
        className="h-full border-8 border-destructive flex flex-col gap-3 md:gap-5 p-4 md:p-8 lg:p-12"
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
    <div className="flex flex-col gap-4 w-full">
      {/* Row 1: Truth label + Controls */}
      <div className="flex items-center justify-between">
        {/* "Moment of Truth" label */}
        <p className="font-space text-xs font-normal leading-4 tracking-[3.6px] uppercase text-destructive">
          <FormattedMessage id="reveal_game.moment_of_truth" defaultMessage="Moment of Truth" />
        </p>

        {/* Reveal count + Sound toggle */}
        <div className="flex gap-4 items-center">
          {/* Reveal count indicator */}
          <div className="border-2 border-destructive flex items-center justify-center p-3 lg:px-[26px] lg:py-[14px] h-12">
            <p className="font-space text-sm font-medium leading-5 text-destructive whitespace-nowrap">
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
      </div>

      {/* Row 2: Reveal title + Host badge */}
      <div className="flex items-end justify-between">
        {/* "Reveal" title */}
        <h1 className="font-bricolage font-bold text-[64px] md:text-[96px] lg:text-[104px] leading-[0.85] text-black">
          <FormattedMessage id="reveal_game.reveal" defaultMessage="Reveal" />
        </h1>

        {/* Host badge with speech bubble - hidden on mobile */}
        <div className="hidden md:block">
          <GameHostBadge host={host} />
        </div>
      </div>

      {/* Host badge - shown only on mobile */}
      <div className="md:hidden">
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
        <div
          className={cn(
            "grid gap-x-[6px] gap-y-4 md:gap-y-5 lg:gap-[30px] pb-4",
            // Mobile: 2 columns centered, Desktop: auto-fill
            "grid-cols-2 justify-items-center md:justify-items-stretch",
            "md:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]",
          )}
        >
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
