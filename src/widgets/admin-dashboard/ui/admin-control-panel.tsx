"use client";

import { useQuery } from "@tanstack/react-query";
import { gameQueries, ADMIN_ACTIONS_BY_STATUS, GameStatus } from "@/entities/game";
import {
  StartGameButton,
  FinalizeSelectionButton,
  RevealBombsButton,
  FinalizeVotingButton,
  ResetGameButton,
} from "@/features/admin-game-controls";

export function AdminControlPanel() {
  const { data: state } = useQuery(gameQueries.status());

  if (!state) return null;

  const availableActions = ADMIN_ACTIONS_BY_STATUS[state.status];

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-4 text-lg font-semibold">Admin Controls</h2>

      <div className="flex flex-wrap gap-3">
        {availableActions.includes("start_game") && (
          <StartGameButton currentStatus={state.status} playersCount={state.playersCount} />
        )}

        {availableActions.includes("finalize_selection") && <FinalizeSelectionButton currentStatus={state.status} />}

        {availableActions.includes("reveal_bombs") && <RevealBombsButton currentStatus={state.status} />}

        {availableActions.includes("finalize_voting") && <FinalizeVotingButton currentStatus={state.status} />}

        {availableActions.includes("reset_game") && <ResetGameButton currentStatus={state.status} />}
      </div>
    </div>
  );
}
