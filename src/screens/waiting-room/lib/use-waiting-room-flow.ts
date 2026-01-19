import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { gameQueries, type Player } from "@/entities/game";
import type { PlayerSeat } from "@/entities/player-seat";

const MIN_PLAYERS_FOR_COUNTDOWN = 5;
const COUNTDOWN_SECONDS = 60;

/**
 * Map contract players to PlayerSeat format
 */
function mapPlayersToSeats(players: Player[]): PlayerSeat[] {
  return players.map((player, index) => ({
    seatNumber: index + 1,
    player: {
      name: player.name,
      role: `PLAYER ${index + 1}`,
    },
    isOccupied: true,
    isReady: true,
  }));
}

export function useWaitingRoomFlow() {
  // Query players list (staggered polling configured in query factory)
  const { data: players = [], isLoading } = useQuery(gameQueries.players());

  // Transform players to seats
  const seats = mapPlayersToSeats(players);
  const connectedPlayers = players.length;
  const hasMinPlayers = connectedPlayers >= MIN_PLAYERS_FOR_COUNTDOWN;

  // Countdown state
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [isCountdownActive, setIsCountdownActive] = useState(false);

  // Start countdown when minimum players reached
  useEffect(() => {
    if (hasMinPlayers && !isCountdownActive) {
      setIsCountdownActive(true);
      setCountdown(COUNTDOWN_SECONDS);
    }
  }, [hasMinPlayers, isCountdownActive]);

  // Countdown timer
  useEffect(() => {
    if (!isCountdownActive || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCountdownActive, countdown]);

  // Guard will detect gameState.status >= SELECTION → navigate to /pass

  return {
    seats,
    connectedPlayers,
    countdown,
    isCountdownActive,
    isLoading,
  };
}
