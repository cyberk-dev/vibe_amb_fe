"use client";

import { useMutation } from "@tanstack/react-query";
import type { PassToPlayerPayload, PassToPlayerResponse } from "../model/types";
import { usePassSelectionStore } from "../model/store";

/**
 * MOCK: Simulate API call to pass packet to another player
 * Replace with actual API call when backend is ready
 */
async function passToPlayerApi(payload: PassToPlayerPayload): Promise<PassToPlayerResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock success response
  console.log("[MOCK] Passing packet:", payload);
  return {
    success: true,
    message: `Packet passed from ${payload.fromPlayerId} to ${payload.toPlayerId}`,
  };
}

/**
 * Hook for passing packet to another player
 *
 * Usage:
 * ```tsx
 * const { mutateAsync: passToPlayer, isPending } = usePassToPlayer();
 *
 * const handleConfirmPass = async () => {
 *   await passToPlayer({
 *     gameId: "game-123",
 *     fromPlayerId: currentUser.id,
 *     toPlayerId: selectedPlayerId,
 *   });
 * };
 * ```
 */
export function usePassToPlayer() {
  const { setIsPassing, resetSelection } = usePassSelectionStore();

  return useMutation({
    mutationFn: passToPlayerApi,
    onMutate: () => {
      setIsPassing(true);
    },
    onSuccess: (data) => {
      console.log("[usePassToPlayer] Pass successful:", data);
      // Reset selection after successful pass
      // In real implementation, the game state would update via websocket/polling
      resetSelection();
    },
    onError: (error) => {
      console.error("[usePassToPlayer] Pass failed:", error);
      setIsPassing(false);
    },
    onSettled: () => {
      setIsPassing(false);
    },
  });
}
