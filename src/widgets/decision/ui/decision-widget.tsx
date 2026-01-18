"use client";

import * as React from "react";
import { FormattedMessage } from "react-intl";
import { cn } from "@/shared/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { DecisionHeader } from "./decision-header";
import { EliminatedPlayerCard } from "./eliminated-player-card";
import { RemainingPlayersGrid } from "./remaining-players-grid";
import { DecisionCards } from "./decision-cards";
import { MobileDecisionLayout } from "./mobile-decision-layout";

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
  prizePerPlayer: number;
  /** Total prize pool */
  totalPool: number;
  /** Next round pool (if continuing) */
  nextRoundPool: number;
  /** Vote counts for each option */
  voteCounts: VoteCounts;
  /** Whether sound is muted */
  isMuted: boolean;
  /** Callback when sound toggle is clicked */
  onToggleMute: () => void;
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
  isMuted,
  onToggleMute,
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
        isMuted={isMuted}
        onToggleMute={onToggleMute}
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
        "h-full w-full overflow-auto",
        "bg-gradient-to-br from-[#fff7ed] via-white to-[#fef2f2]",
        className,
      )}
    >
      {/* Border frame - teal */}
      <div className="relative border-8 border-custom-teal min-h-full w-full">
        {/* Main content container with padding */}
        <div className="relative z-10 flex flex-col gap-12 min-h-full p-[72px] pb-0">
          {/* Header section */}
          <DecisionHeader totalPlayers={totalPlayers} isMuted={isMuted} onToggleMute={onToggleMute} />

          {/* Vote count cards */}
          <div className="flex gap-4">
            {/* Share votes card */}
            <div className="flex items-center gap-3 border-2 border-custom-teal bg-custom-teal/10 px-6 py-3">
              <div className="size-10 bg-custom-teal flex items-center justify-center">
                <span className="font-space text-lg font-bold text-white">{voteCounts.share}</span>
              </div>
              <span className="font-space text-sm font-medium text-custom-teal uppercase tracking-wider">
                <FormattedMessage id="decision.widget.vote_share" />
              </span>
            </div>

            {/* Continue votes card */}
            <div className="flex items-center gap-3 border-2 border-custom-vivid-red bg-custom-vivid-red/10 px-6 py-3">
              <div className="size-10 bg-custom-vivid-red flex items-center justify-center">
                <span className="font-space text-lg font-bold text-white">{voteCounts.continue}</span>
              </div>
              <span className="font-space text-sm font-medium text-custom-vivid-red uppercase tracking-wider">
                <FormattedMessage id="decision.widget.vote_continue" />
              </span>
            </div>
          </div>

          {/* Eliminated player card */}
          <EliminatedPlayerCard player={eliminatedPlayer} />

          {/* Remaining players section */}
          <RemainingPlayersGrid players={remainingPlayers} />

          {/* Decision cards - flex-1 to push footer down */}
          <div className="flex-1 flex flex-col">
            <DecisionCards
              prizePerPlayer={prizePerPlayer}
              totalPool={totalPool}
              onSharePrize={onSharePrize}
              onContinuePlaying={onContinuePlaying}
              isVoting={isVoting}
              currentUserVote={currentUserVote}
            />
          </div>

          {/* Footer */}
          <div className="border-t-2 border-black/10 py-8">
            <p className="font-space text-xs uppercase tracking-[1.6px] text-black/40">
              <FormattedMessage id="decision.widget.footer" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
