"use client";

import { GameOverviewPanel } from "./game-overview-panel";
import { PlayersTable } from "./players-table";
import { AdminControlPanel } from "./admin-control-panel";
import { VotingStatusPanel } from "./voting-status-panel";
import { useAdminDashboardState } from "../lib/use-admin-dashboard-state";
import { GameStatus } from "@/entities/game";

export function AdminDashboard() {
  const { overview, isLoading, error } = useAdminDashboardState();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-red-400">Error loading dashboard</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GameOverviewPanel />
      <AdminControlPanel />

      {overview?.status === GameStatus.VOTING && (
        <VotingStatusPanel />
      )}

      <PlayersTable />
    </div>
  );
}
