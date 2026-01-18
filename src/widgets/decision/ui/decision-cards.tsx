"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";

interface DecisionCardsProps {
  prizePerPlayer: number;
  totalPool: number;
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

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1", className)}>
      {/* Option A - Share Prize */}
      <div
        className={cn(
          "bg-white border-4 border-custom-teal",
          "flex flex-col justify-between",
          "p-8 md:pt-[52px] md:px-[52px] md:pb-0",
        )}
      >
        <div className="flex flex-col gap-6">
          {/* Option label */}
          <div className="border-2 border-custom-teal w-fit px-4 py-2">
            <span className="font-space text-xs font-normal uppercase tracking-[2.4px] text-custom-teal">Option A</span>
          </div>

          {/* Title */}
          <h2 className="font-bricolage text-5xl md:text-7xl font-bold leading-[1] text-custom-teal">
            Share
            <br />
            Prize
          </h2>

          {/* Description */}
          <p className="font-space text-sm font-normal uppercase tracking-[0.7px] text-black/60">
            End the game now and split equally
          </p>

          {/* Prize box */}
          <div className="bg-custom-teal/5 border-2 border-custom-teal p-8 flex flex-col items-center gap-2">
            <span className="font-bricolage text-5xl md:text-6xl font-bold text-custom-teal">
              ${prizePerPlayer.toFixed(2)}
            </span>
            <span className="font-space text-xs font-normal uppercase tracking-[0.6px] text-custom-teal">
              Per Player
            </span>
          </div>
        </div>

        {/* Action button - sticks to bottom on desktop */}
        <button
          type="button"
          onClick={onSharePrize}
          disabled={isVoting || hasVotedShare}
          className={cn(
            "w-full h-[60px] mt-8 md:mt-auto",
            "bg-custom-teal text-white",
            "font-space text-sm font-bold uppercase tracking-[2.8px]",
            "hover:opacity-90 transition-opacity",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          {hasVotedShare ? "Voted" : "Share Prize"}
        </button>
      </div>

      {/* Option B - Keep Playing */}
      <div
        className={cn(
          "bg-custom-vivid-red border-4 border-custom-vivid-red",
          "flex flex-col justify-between",
          "p-8 md:pt-[52px] md:px-[52px] md:pb-0",
        )}
      >
        <div className="flex flex-col gap-6">
          {/* Option label */}
          <div className="border-2 border-white/40 w-fit px-4 py-2">
            <span className="font-space text-xs font-normal uppercase tracking-[2.4px] text-white/90">Option B</span>
          </div>

          {/* Title */}
          <h2 className="font-bricolage text-5xl md:text-7xl font-bold leading-[1] text-white">
            Keep
            <br />
            Playing
          </h2>

          {/* Description */}
          <p className="font-space text-sm font-normal uppercase tracking-[0.7px] text-white/80">
            Eliminate more players for bigger shares
          </p>

          {/* Prize box */}
          <div className="bg-white/10 border-2 border-white/40 p-8 flex flex-col items-center gap-2">
            <span className="font-bricolage text-5xl md:text-6xl font-bold text-white">${totalPool}</span>
            <span className="font-space text-xs font-normal uppercase tracking-[0.6px] text-white/80">Total Pool</span>
          </div>
        </div>

        {/* Action button - sticks to bottom on desktop */}
        <button
          type="button"
          onClick={onContinuePlaying}
          disabled={isVoting || hasVotedContinue}
          className={cn(
            "w-full h-[60px] mt-8 md:mt-auto",
            "bg-black text-white",
            "font-space text-sm font-bold uppercase tracking-[2.8px]",
            "hover:opacity-90 transition-opacity",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          {hasVotedContinue ? "Voted" : "Continue Playing"}
        </button>
      </div>
    </div>
  );
}
