import { useQuery } from "@tanstack/react-query";
import { gameQueries, type Player } from "@/entities/game";
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
  // Query players list (staggered polling configured in query factory)
  const { data: players = [], isLoading } = useQuery(gameQueries.players());

  // Transform players to seats
  const seats = mapPlayersToSeats(players, MAX_SEATS);
  const connectedPlayers = players.length;
  const isRoomFull = connectedPlayers >= MAX_SEATS;

  // Guard will detect gameState.status >= SELECTION → navigate to /pass

  return {
    seats,
    maxSeats: MAX_SEATS,
    connectedPlayers,
    isRoomFull,
    countdown: COUNTDOWN_SECONDS, // Static for now
    isLoading,
  };
}
