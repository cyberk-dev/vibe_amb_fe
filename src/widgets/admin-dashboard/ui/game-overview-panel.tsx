"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Decimal from "decimal.js";
import { gameQueries, GameStatusBadge, formatAptAmount, STATUS_DESCRIPTIONS } from "@/entities/game";
import { vaultQueries } from "@/entities/vault";
import { useFundVault } from "@/features/fund-vault";
import { InlineLoader } from "@/shared/ui";
import { useHoverSound } from "@/shared/lib";

export function GameOverviewPanel() {
  const { data: state } = useQuery(gameQueries.status());
  const { data: prizes } = useQuery(gameQueries.prizes());
  const { data: vaultBalance } = useQuery(vaultQueries.balance());

  const { mutate: fundVault, isPending: isFunding } = useFundVault();
  const [fundAmount, setFundAmount] = useState("");
  const { onMouseEnter: playHoverSound } = useHoverSound();

  const handleFund = () => {
    try {
      const amount = new Decimal(fundAmount);
      if (amount.gt(0)) {
        fundVault(fundAmount);
        setFundAmount("");
      }
    } catch {
      // Invalid decimal input
    }
  };

  if (!state) return <InlineLoader />;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-4 text-lg font-semibold">Game Overview</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
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

        <div>
          <span className="text-sm text-gray-400">Vault Balance</span>
          <div className="mt-1 text-xl font-bold text-blue-400">
            {vaultBalance !== undefined ? formatAptAmount(vaultBalance) : "-"}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Amount (APT)"
          value={fundAmount}
          onChange={(e) => setFundAmount(e.target.value)}
          className="w-32 rounded border border-white/20 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
          disabled={isFunding}
        />
        <button
          onClick={handleFund}
          onMouseEnter={playHoverSound}
          disabled={isFunding || !fundAmount}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isFunding ? "Funding..." : "Fund Vault"}
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-400">{STATUS_DESCRIPTIONS[state.status]}</p>
    </div>
  );
}
