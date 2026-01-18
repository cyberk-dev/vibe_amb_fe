"use client";

import * as React from "react";
import { FormattedMessage } from "react-intl";
import { cn } from "@/shared/lib/utils";
import type { DecisionPlayer } from "./decision-widget";

interface RemainingPlayersGridProps {
  players: DecisionPlayer[];
  className?: string;
}

interface PlayerChipProps {
  player: DecisionPlayer;
}

/**
 * PlayerChip - Individual player chip with vote status
 *
 * States:
 * - share: Teal background (voted to share)
 * - continue: Orange background (voted to continue)
 * - pending: White background with black border (not voted)
 */
function PlayerChip({ player }: PlayerChipProps) {
  const voteStatus = player.voteStatus ?? "pending";

  const chipStyles = {
    share: "bg-custom-teal/20 border-custom-teal",
    continue: "bg-custom-vivid-red/10 border-custom-vivid-red",
    pending: "bg-white border-black",
  };

  return (
    <div className={cn("h-[60px] border-2 px-6 py-2", "flex items-center gap-3", chipStyles[voteStatus])}>
      {/* Seat number badge */}
      <div className="size-8 bg-black flex items-center justify-center flex-shrink-0">
        <span className="font-space text-sm font-bold text-white">{player.seatNumber}</span>
      </div>

      {/* Player name */}
      <span className="font-space text-sm font-bold text-black truncate">{player.name}</span>
    </div>
  );
}

/**
 * RemainingPlayersGrid - Grid of remaining players with vote status
 *
 * Shows all remaining players as chips with their vote status:
 * - Teal: Voted to share
 * - Orange: Voted to continue
 * - White: Not yet voted
 */
export function RemainingPlayersGrid({ players, className }: RemainingPlayersGridProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Section label */}
      <p className="font-space text-xs font-normal uppercase tracking-[3.6px] text-black/40">
        <FormattedMessage id="decision.remaining_players.label" />
      </p>

      {/* Players grid - wrapping flex */}
      <div className="flex flex-wrap gap-3">
        {players.map((player) => (
          <PlayerChip key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}
