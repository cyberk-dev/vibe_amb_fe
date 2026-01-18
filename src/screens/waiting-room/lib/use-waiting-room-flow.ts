import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { gameQueries, type Player, GameStatus } from "@/entities/game";
import type { PlayerSeat } from "@/entities/player-seat";

const MAX_SEATS = 20;
const COUNTDOWN_SECONDS = 60;

/**
 * Map contract players to PlayerSeat format
 */
function mapPlayersToSeats(players: Player[], maxSeats: number): PlayerSeat[] {
  const seats: PlayerSeat[] = [];

  // Add occupied seats for actual players (in join order)
  players.forEach((player, index) => {
    seats.push({
      seatNumber: index + 1,
      player: {
        name: player.name,
        role: `PLAYER ${index + 1}`,
      },
      isOccupied: true,
      isReady: true,
    });
  });

  // Fill remaining slots with empty/waiting placeholders
  for (let i = players.length; i < maxSeats; i++) {
    seats.push({
      seatNumber: i + 1,
      player: undefined,
      isOccupied: false,
      isReady: false,
    });
  }

  return seats;
}

export function useWaitingRoomFlow() {
  const router = useRouter();

  // Query game status (for detecting game start)
  const { data: gameState } = useQuery({
    ...gameQueries.status(),
  });

  // Query players list (staggered polling configured in query factory)
  const { data: players = [], isLoading } = useQuery(gameQueries.players());

  // Transform players to seats
  const seats = mapPlayersToSeats(players, MAX_SEATS);
  const connectedPlayers = players.length;
  const isRoomFull = connectedPlayers >= MAX_SEATS;

  // Redirect to /pass when game starts (status changes from PENDING to SELECTION)
  useEffect(() => {
    if (gameState?.status === GameStatus.SELECTION) {
      router.push("/pass");
    }
  }, [gameState?.status, router]);

  return {
    seats,
    maxSeats: MAX_SEATS,
    connectedPlayers,
    isRoomFull,
    countdown: COUNTDOWN_SECONDS, // Static for now
    isLoading,
  };
}
