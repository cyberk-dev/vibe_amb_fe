import { cn } from "@/shared/lib/utils";
import { truncateAddress } from "../lib/mappers";
import { PlayerStatusIndicator } from "./player-status-indicator";
import type { Player } from "../model/types";

interface PlayerListItemProps {
  player: Player;
  index: number;
  isVictim?: boolean;
  actionSlot?: React.ReactNode; // Render props for feature actions
}

export function PlayerListItem({ player, index, isVictim = false, actionSlot }: PlayerListItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border p-3 transition-colors",
        isVictim ? "border-red-500/30 bg-red-500/10" : "border-white/10 bg-white/5 hover:bg-white/10",
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">#{index + 1}</span>
        <code className="font-mono text-sm">{truncateAddress(player.address)}</code>
        {isVictim && <span className="rounded bg-red-500/20 px-2 py-0.5 text-xs text-red-400">Eliminated</span>}
      </div>
      <div className="flex items-center gap-3">
        <PlayerStatusIndicator hasActed={player.hasActed} size="sm" />
        {actionSlot}
      </div>
    </div>
  );
}
