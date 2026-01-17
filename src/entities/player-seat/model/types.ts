// Player Seat Entity - Types
// Defines the structure for player seats in the lobby/game

export interface PlayerSeat {
  /** Seat number/position (1-indexed) */
  seatNumber: number;

  /** Player information if seat is occupied */
  player?: {
    /** Player display name */
    name: string;
    /** Player role label (e.g., "PLAYER 1", "PLAYER 2") */
    role: string;
  };

  /** Whether the seat is occupied by a player */
  isOccupied: boolean;

  /** Whether the player in this seat is ready (only relevant if occupied) */
  isReady?: boolean;
}
