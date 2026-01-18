"use client";

import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";
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
  const intl = useIntl();
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
              <FormattedMessage id="decision.header.critical_choice" />
            </p>
            <h1 className="font-bricolage text-[60px] font-bold leading-[0.85] text-black">
              <FormattedMessage id="decision.header.title" />
            </h1>

            {/* Controls row */}
            <div className="flex items-center gap-3 mt-2">
              <div className="h-9 border-[1.8px] border-custom-teal px-4 flex items-center">
                <span className="font-space text-xs font-medium text-custom-teal">
                  <FormattedMessage id="decision.header.players" values={{ count: totalPlayers }} />
                </span>
              </div>
              <button
                type="button"
                onClick={onToggleMute}
                className="size-10 bg-custom-light-orange flex items-center justify-center"
                aria-label={
                  isMuted
                    ? intl.formatMessage({ id: "waiting_room.aria.unmute" })
                    : intl.formatMessage({ id: "waiting_room.aria.mute" })
                }
              >
                {isMuted ? <VolumeX className="size-5 text-white" /> : <Volume2 className="size-5 text-white" />}
              </button>
            </div>
          </div>

          {/* Prize Pool Card */}
          <div className="bg-white border-[1.8px] border-custom-teal p-4 flex flex-col gap-4">
            <p className="font-space text-[10px] font-normal uppercase tracking-[2px] text-custom-teal">
              <FormattedMessage id="decision.mobile.current_prize_pool" />
            </p>

            <div className="flex flex-col gap-2">
              <p className="font-bricolage text-5xl font-bold text-black">${totalPool.toFixed(2)}</p>
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
          </div>

          {/* Eliminated section */}
          <div className="flex flex-col gap-3">
            <p className="font-space text-[10px] font-normal uppercase tracking-[2px] text-black/40">
              <FormattedMessage id="decision.eliminated.eliminated_count" values={{ count: 1 }} />
            </p>
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
              <FormattedMessage id="decision.mobile.make_your_choice" />
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
            </button>
          </div>

          {/* Footer */}
          <div className="border-t border-black/10 pt-6">
            <p className="font-space text-[10px] font-normal uppercase tracking-[1.5px] text-black/40 text-center">
              <FormattedMessage id="decision.widget.footer" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
