"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import type { GamePlayer, GameHost } from "@/entities/game";
import { PassGame } from "@/widgets/pass-game";
import { usePassSelectionStore, usePassToPlayer } from "@/features/pass-to-player";
import { PlayerAlreadySelectedDialog } from "@/features/pass-to-player/ui/player-already-selected-dialog";
import { isTargetAlreadySelectedError } from "@/integrations/aptos/utils/error-parser";
import { gameQueries, GameStatus } from "@/entities/game";
import { useQuery } from "@tanstack/react-query";

/** Constants for the pass game */
const INITIAL_COUNTDOWN = 60;
const COUNTDOWN_INTERVAL_MS = 1000;
const TOTAL_PLAYERS = 20;

/** Fake player names for simulation */
const FAKE_PLAYER_NAMES = [
  "Manh",
  "Alex",
  "Sarah",
  "John",
  "Emily",
  "David",
  "Lisa",
  "Mike",
  "Anna",
  "Chris",
  "Emma",
  "James",
  "Olivia",
  "Daniel",
  "Sophia",
  "William",
  "Ava",
  "Joseph",
  "Mia",
  "Thomas",
];

/** Default host configuration */
const DEFAULT_HOST: GameHost = {
  name: "Mr. Horse",
  role: "Admin",
  avatarUrl: "https://www.figma.com/api/mcp/asset/96329116-3447-40bf-86b3-3ca73059ad0d",
  message: "Make right decision...",
};

/** Default packet image URL (from Figma) */
const DEFAULT_PACKET_IMAGE = "https://www.figma.com/api/mcp/asset/94d322f7-9d29-43ad-89e2-47a9096985c8";

/** Current user ID (for demo purposes) */
const CURRENT_USER_ID = "player-1";

/**
 * Generate fake players for simulation
 */
function generateFakePlayers(): GamePlayer[] {
  return Array.from({ length: TOTAL_PLAYERS }, (_, index) => ({
    id: `player-${index + 1}`,
    name: FAKE_PLAYER_NAMES[index % FAKE_PLAYER_NAMES.length],
    seatNumber: index + 1,
    isCurrentUser: index === 0, // First player is current user
    isEliminated: false,
  }));
}

/**
 * PassScreen - Screen for the pass phase of the game
 *
 * Features:
 * - 20 player grid for selection
 * - Red packet display
 * - Countdown timer
 * - Host/admin badge with speech bubble
 * - Player selection with confirmation
 *
 * Flow:
 * - User sees their packet and all players
 * - User selects a player to pass to (or can keep for self by timeout)
 * - User confirms the pass
 * - After confirm or timeout, move to next phase
 *
 * Note: This screen uses fake data. Replace with actual game state
 * from contract/backend when API is ready.
 */
export function PassScreen() {
  const router = useRouter();

  // Game state
  const [players] = useState<GamePlayer[]>(generateFakePlayers);
  const [countdown, setCountdown] = useState(INITIAL_COUNTDOWN);
  const [round] = useState(1);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Selection state from store
  const { selectedPlayerId, togglePlayer, isConfirmed, isPassing } = usePassSelectionStore();

  // Pass mutation
  const { mutateAsync: passToPlayer, isPending } = usePassToPlayer();

  // Dialog state for player already selected error
  const [showPlayerAlreadySelectedDialog, setShowPlayerAlreadySelectedDialog] = useState(false);

  // Monitor game status - redirect to game-over when game ends
  const { data: gameStatus } = useQuery(gameQueries.status());

  useEffect(() => {
    // When game status becomes ENDED, redirect to game-over screen
    if (gameStatus?.status === GameStatus.ENDED) {
      router.push("/game-over");
    }
  }, [gameStatus?.status, router]);

  // Countdown timer
  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Timer expired - redirect to game-over for testing
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
          }
          // Redirect to game-over screen after a short delay
          setTimeout(() => {
            router.push("/game-over");
          }, 500);
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
  }, [router]);

  // Handle player selection
  const handlePlayerSelect = useCallback(
    (playerId: string) => {
      if (isConfirmed || isPassing || isPending) return;
      togglePlayer(playerId);
    },
    [isConfirmed, isPassing, isPending, togglePlayer],
  );

  // Handle confirm pass
  const handleConfirmPass = useCallback(async () => {
    if (!selectedPlayerId || isConfirmed || isPassing || isPending) return;

    try {
      await passToPlayer({
        gameId: "game-demo-1",
        fromPlayerId: CURRENT_USER_ID,
        toPlayerId: selectedPlayerId,
      });

      // In real implementation, game state would update via websocket/polling
      // and screen would transition to reveal phase
      console.log("[PassScreen] Pass confirmed successfully");
    } catch (error) {
      console.error("[PassScreen] Pass failed:", error);

      // Check if error is about player already selected
      if (isTargetAlreadySelectedError(error)) {
        setShowPlayerAlreadySelectedDialog(true);
      }
    }
  }, [selectedPlayerId, isConfirmed, isPassing, isPending, passToPlayer]);

  return (
    <>
      <PassGame
        round={round}
        countdown={countdown}
        players={players}
        currentUserId={CURRENT_USER_ID}
        host={DEFAULT_HOST}
        packetImageUrl={DEFAULT_PACKET_IMAGE}
        selectedPlayerId={selectedPlayerId}
        onPlayerSelect={handlePlayerSelect}
        onConfirmPass={handleConfirmPass}
        isPassing={isPassing || isPending}
      />

      <PlayerAlreadySelectedDialog
        open={showPlayerAlreadySelectedDialog}
        onOpenChange={setShowPlayerAlreadySelectedDialog}
      />
    </>
  );
}
