"use client";

import { useQuery } from "@tanstack/react-query";
import { gameQueries, PlayerListItem } from "@/entities/game";

export function PlayersTable() {
  const { data: players = [], isLoading } = useQuery(gameQueries.players());
  const { data: victims = [] } = useQuery(gameQueries.victims());

  if (isLoading) {
    return <div className="py-8 text-center">Loading players...</div>;
  }

  if (players.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-gray-400">No players have joined yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-4 text-lg font-semibold">
        Players ({players.length})
      </h2>
      <div className="space-y-2">
        {players.map((player, index) => (
          <PlayerListItem
            key={player.address}
            player={player}
            index={index}
            isVictim={victims.includes(player.address)}
          />
        ))}
      </div>
    </div>
  );
}
