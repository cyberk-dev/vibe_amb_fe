"use client";

import { useState, useEffect, useRef } from "react";
import { PassGame } from "@/widgets/pass-game";
import { PlayerAlreadySelectedDialog } from "@/features/pass-to-player/ui/player-already-selected-dialog";
import { usePassFlow } from "../lib/use-pass-flow";

/** Constants for the pass game */
const INITIAL_COUNTDOWN = 60;
const COUNTDOWN_INTERVAL_MS = 1000;

/**
 * PassScreen - Screen for the pass phase of the game
 *
 * Features:
 * - Player grid for selection
 * - Red packet display
 * - Countdown timer
 * - Player selection with confirmation
 *
 * Flow:
 * - User sees their packet and all players
 * - User selects a player to pass to (or can keep for self by timeout)
 * - User confirms the pass
 * - GameFlowGuard handles phase transitions (reveal, vote, game-over)
 */
export function PassScreen() {
  // Pass flow hook with contract integration
  const {
    players,
    currentUserAddress,
    round,
    hasSelected,
    selectedPlayerId,
    togglePlayer,
    confirmPass,
    isConfirming,
    showAlreadySelectedDialog,
    setShowAlreadySelectedDialog,
  } = usePassFlow();

  // Countdown state
  const [countdown, setCountdown] = useState(INITIAL_COUNTDOWN);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown timer
  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, COUNTDOWN_INTERVAL_MS);

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  // Handle player selection
  const handlePlayerSelect = (playerId: string) => {
    if (hasSelected || isConfirming) return;
    togglePlayer(playerId);
  };

  // Handle confirm pass
  const handleConfirmPass = async () => {
    if (!selectedPlayerId || hasSelected || isConfirming) return;
    await confirmPass();
  };

  return (
    <>
      <PassGame
        round={round}
        countdown={countdown}
        players={players}
        currentUserId={currentUserAddress ?? ""}
        selectedPlayerId={selectedPlayerId}
        onPlayerSelect={handlePlayerSelect}
        onConfirmPass={handleConfirmPass}
        isPassing={isConfirming}
      />

      <PlayerAlreadySelectedDialog open={showAlreadySelectedDialog} onOpenChange={setShowAlreadySelectedDialog} />
    </>
  );
}
