"use client";

import { useQuery } from "@tanstack/react-query";
import { gameQueries, VOTE_LABELS } from "@/entities/game";
import { Vote } from "@/integrations/aptos";

export function VotingStatusPanel() {
  const { data: voting } = useQuery(gameQueries.voting());

  if (!voting) return null;

  const stopPercentage = voting.total > 0 ? (voting.stopCount / voting.total) * 100 : 0;
  const continuePercentage = voting.total > 0 ? (voting.continueCount / voting.total) * 100 : 0;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-4 text-lg font-semibold">Voting Status</h2>

      <div className="space-y-4">
        {/* Progress bars */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-red-400">{VOTE_LABELS[Vote.STOP]}</span>
            <span className="text-gray-400">{voting.stopCount} votes</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-700">
            <div className="h-full bg-red-500 transition-all" style={{ width: `${stopPercentage}%` }} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-400">{VOTE_LABELS[Vote.CONTINUE]}</span>
            <span className="text-gray-400">{voting.continueCount} votes</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-700">
            <div className="h-full bg-green-500 transition-all" style={{ width: `${continuePercentage}%` }} />
          </div>
        </div>

        {/* Summary */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4 text-sm">
          <span className="text-gray-400">Missing votes</span>
          <span className="font-medium">{voting.missingCount}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Total voters</span>
          <span className="font-medium">{voting.total}</span>
        </div>
      </div>
    </div>
  );
}
