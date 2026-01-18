"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { Volume2, VolumeX } from "lucide-react";
import type { EliminatedPlayer } from "./decision-widget";

interface MobileDecisionLayoutProps {
  totalPlayers: number;
  eliminatedPlayer: EliminatedPlayer;
  prizePerPlayer: number;
  totalPool: number;
  nextRoundPool: number;
  isMuted: boolean;
  onToggleMute: () => void;
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
  isMuted,
  onToggleMute,
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
        <div className="flex flex-col gap-6 p-5">
          {/* Header */}
          <div className="flex flex-col gap-3">
            <p className="font-space text-[10px] font-normal uppercase tracking-[2px] text-custom-teal">
              Critical Choice
            </p>
            <h1 className="font-bricolage text-[60px] font-bold leading-[0.85] text-black">Decision</h1>

            {/* Controls row */}
            <div className="flex items-center gap-3 mt-2">
              <div className="h-9 border-[1.8px] border-custom-teal px-4 flex items-center">
                <span className="font-space text-xs font-medium text-custom-teal">{totalPlayers} Players</span>
              </div>
              <button
                type="button"
                onClick={onToggleMute}
                className="size-10 bg-custom-light-orange flex items-center justify-center"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="size-5 text-white" /> : <Volume2 className="size-5 text-white" />}
              </button>
            </div>
          </div>

          {/* Prize Pool Card */}
          <div className="bg-white border-[1.8px] border-custom-teal p-4 flex flex-col gap-4">
            <p className="font-space text-[10px] font-normal uppercase tracking-[2px] text-custom-teal">
              Current Prize Pool
            </p>

            <div className="flex flex-col gap-2">
              <p className="font-bricolage text-5xl font-bold text-black">${totalPool.toFixed(2)}</p>
              <p className="font-space text-xs font-normal uppercase tracking-[0.3px] text-black/60">
                {totalPlayers} players remaining
              </p>
            </div>

            {/* Divider and stats */}
            <div className="border-t border-black/10 pt-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="font-space text-[10px] font-normal uppercase tracking-[0.25px] text-black/60">
                  If shared now:
                </p>
                <p className="font-space text-sm font-bold text-black">${prizePerPlayer.toFixed(2)} each</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-space text-[10px] font-normal uppercase tracking-[0.25px] text-black/60">
                  Next round pool:
                </p>
                <p className="font-space text-sm font-bold text-custom-teal">${nextRoundPool.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Eliminated section */}
          <div className="flex flex-col gap-3">
            <p className="font-space text-[10px] font-normal uppercase tracking-[2px] text-black/40">Eliminated (1)</p>
            <div className="bg-white/50 border border-black/10 px-2 py-2 flex items-center gap-2 w-fit">
              <div className="size-6 bg-black/10 flex items-center justify-center">
                <span className="font-space text-[10px] font-bold text-black/30">✕</span>
              </div>
              <span className="font-space text-[10px] font-medium text-black/50">{eliminatedPlayer.name}</span>
            </div>
          </div>

          {/* Make Your Choice section */}
          <div className="flex flex-col gap-3">
            <p className="font-space text-[10px] font-normal uppercase tracking-[2px] text-black/40">
              Make Your Choice
            </p>

            {/* Share Now button */}
            <button
              type="button"
              onClick={onSharePrize}
              disabled={isVoting || hasVotedShare}
              className={cn(
                "w-full p-6 text-left",
                "bg-custom-teal border-[1.8px] border-custom-teal",
                "disabled:opacity-70",
              )}
            >
              <div className="flex flex-col gap-3">
                <h2 className="font-bricolage text-[30px] font-bold leading-[1.2] text-white">
                  Share
                  <br />
                  Now
                </h2>
                <p className="font-space text-xs font-normal uppercase tracking-[0.3px] text-white/80">
                  {hasVotedShare ? "You voted to share" : `Split $${totalPool.toFixed(2)} equally`}
                </p>
              </div>
            </button>

            {/* Keep Going button */}
            <button
              type="button"
              onClick={onContinuePlaying}
              disabled={isVoting || hasVotedContinue}
              className={cn(
                "w-full p-6 text-left",
                "bg-custom-vivid-red border-[1.8px] border-custom-vivid-red",
                "disabled:opacity-70",
              )}
            >
              <div className="flex flex-col gap-3">
                <h2 className="font-bricolage text-[30px] font-bold leading-[1.2] text-white">
                  Keep
                  <br />
                  Going
                </h2>
                <p className="font-space text-xs font-normal uppercase tracking-[0.3px] text-white/80">
                  {hasVotedContinue ? "You voted to continue" : `Risk for $${nextRoundPool.toFixed(2)}`}
                </p>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="border-t border-black/10 pt-6">
            <p className="font-space text-[10px] font-normal uppercase tracking-[1.5px] text-black/40 text-center">
              we know you are ambitious
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
