"use client";

import { useQuery } from "@tanstack/react-query";
import {
  gameQueries,
  GameStatusBadge,
  formatAptAmount,
  STATUS_DESCRIPTIONS,
} from "@/entities/game";

export function GameOverviewPanel() {
  const { data: state } = useQuery(gameQueries.status());
  const { data: prizes } = useQuery(gameQueries.prizes());

  if (!state) return <div>Loading...</div>;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-4 text-lg font-semibold">Game Overview</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div>
          <span className="text-sm text-gray-400">Status</span>
          <div className="mt-1">
            <GameStatusBadge status={state.status} />
          </div>
        </div>

        <div>
          <span className="text-sm text-gray-400">Round</span>
          <div className="mt-1 text-2xl font-bold">{state.round || "-"}</div>
        </div>

        <div>
          <span className="text-sm text-gray-400">Players</span>
          <div className="mt-1 text-2xl font-bold">{state.playersCount}</div>
        </div>

        <div>
          <span className="text-sm text-gray-400">Prize Pool</span>
          <div className="mt-1 text-xl font-bold text-green-400">
            {prizes ? formatAptAmount(prizes.remainingPool) : "-"}
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-400">
        {STATUS_DESCRIPTIONS[state.status]}
      </p>
    </div>
  );
}
