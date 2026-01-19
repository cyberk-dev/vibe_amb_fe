import { useState, useCallback } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { gameQueries } from "@/entities/game";
import { useChooseBao } from "@/features/choose-bao";
import type { GamePlayer } from "@/entities/game";
import { isTargetAlreadySelectedError } from "@/integrations/aptos/utils/error-parser";

interface UsePassFlowReturn {
  // Data
  players: GamePlayer[];
  currentUserAddress: string | undefined;
  round: number;
  selectionProgress: { selected: number; total: number };
  hasSelected: boolean;

  // Selection state
  selectedPlayerId: string | null;
  togglePlayer: (playerId: string) => void;

  // Actions
  confirmPass: () => Promise<void>;
  isConfirming: boolean;

  // Error dialog
  showAlreadySelectedDialog: boolean;
  setShowAlreadySelectedDialog: (show: boolean) => void;
}

export function usePassFlow(): UsePassFlowReturn {
  const { account } = useWallet();
  const address = account?.address?.toString();

  // Selection state (local)
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [showAlreadySelectedDialog, setShowAlreadySelectedDialog] = useState(false);

  // Game status query
  const { data: gameStatus } = useQuery(gameQueries.status());

  // Players with target status - poll every 3s for real-time updates
  const { data: players = [] } = useQuery({
    ...gameQueries.playersWithTargets(),
    refetchInterval: 3_000,
  });

  // Selection progress - poll every 3s
  const { data: selectionProgress = { selected: 0, total: 0 } } = useQuery({
    ...gameQueries.selectionProgress(),
    refetchInterval: 3_000,
  });

  // Check if current user has already selected - poll every 3s
  const { data: hasSelected = false } = useQuery({
    ...gameQueries.hasSelected(address ?? ""),
    enabled: !!address,
    refetchInterval: 3_000,
  });

  // Choose bao mutation
  const { mutateAsync: chooseBao, isPending: isConfirming } = useChooseBao();

  // Map players to GamePlayer format with isTarget
  const gamePlayers: GamePlayer[] = players.map((p, index) => ({
    id: p.address,
    name: p.name,
    seatNumber: index + 1,
    isCurrentUser: p.address === address,
    isEliminated: false,
    hasActed: p.hasActed,
    isTarget: p.isTarget,
  }));

  // Toggle player selection
  const togglePlayer = useCallback(
    (playerId: string) => {
      console.log("[togglePlayer]", { playerId, hasSelected, isConfirming });
      if (hasSelected || isConfirming) return;
      setSelectedPlayerId((prev) => (prev === playerId ? null : playerId));
    },
    [hasSelected, isConfirming],
  );

  // Confirm pass
  const confirmPass = useCallback(async () => {
    if (!selectedPlayerId || hasSelected || isConfirming) return;

    try {
      await chooseBao({ targetAddress: selectedPlayerId });
      setSelectedPlayerId(null);
    } catch (error) {
      if (isTargetAlreadySelectedError(error)) {
        setShowAlreadySelectedDialog(true);
        setSelectedPlayerId(null);
      }
      // Other errors are handled by mutation toast
    }
  }, [selectedPlayerId, hasSelected, isConfirming, chooseBao]);

  return {
    players: gamePlayers,
    currentUserAddress: address,
    round: gameStatus?.round ?? 1,
    selectionProgress,
    hasSelected,

    selectedPlayerId,
    togglePlayer,

    confirmPass,
    isConfirming,

    showAlreadySelectedDialog,
    setShowAlreadySelectedDialog,
  };
}
