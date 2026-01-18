// =============================================
// Admin Dashboard Types (from Aptos contract)
// =============================================

import { GameStatus, Vote } from "@/integrations/aptos";

export interface Player {
  address: string;
  name: string;
  hasActed: boolean;
}

export interface PlayerWithVote extends Player {
  hasVoted: boolean;
  vote?: Vote;
}

export interface VotingState {
  stopCount: number;
  continueCount: number;
  missingCount: number;
  total: number;
}

export interface RoundPrizes {
  consolationPrize: bigint;
  remainingPool: bigint;
}

export interface GameOverview {
  status: GameStatus;
  round: number;
  playersCount: number;
  eliminationCount: number;
  prizes: RoundPrizes;
  players: Player[];
  voting?: VotingState;
  victims?: string[];
}

// Admin game state for dashboard
export interface AdminGameState {
  status: GameStatus;
  round: number;
  playersCount: number;
  eliminationCount: number;
}

// Re-export for convenience
export { GameStatus, Vote };

// =============================================
// Game UI Types (for player-facing game)
// =============================================

/**
 * Represents a player in the game
 */
export interface GamePlayer {
  /** Unique player identifier */
  id: string;
  /** Player display name */
  name: string;
  /** Player's position/seat number (1-indexed) */
  seatNumber: number;
  /** Whether this is the current user */
  isCurrentUser?: boolean;
  /** Whether this player is eliminated */
  isEliminated?: boolean;
}

/**
 * Represents the admin/host of the game
 */
export interface GameHost {
  /** Host display name */
  name: string;
  /** Host avatar image URL */
  avatarUrl?: string;
  /** Host role label (e.g., "Admin") */
  role: string;
  /** Optional speech bubble message */
  message?: string;
}

/**
 * Represents the state of a red packet (lì xì)
 */
export interface RedPacket {
  /** Unique packet identifier */
  id: string;
  /** Packet image/illustration URL */
  imageUrl?: string;
  /** Whether this packet is explosive (eliminates player) */
  isExplosive?: boolean;
  /** Whether packet has been revealed */
  isRevealed?: boolean;
}

/**
 * Represents the current game state (player-facing)
 */
export interface GameState {
  /** Current round number */
  round: number;
  /** Total number of rounds */
  totalRounds?: number;
  /** Countdown timer value in seconds */
  countdown: number;
  /** Current phase of the game */
  phase: GamePhase;
  /** All players in the game */
  players: GamePlayer[];
  /** The game host/admin */
  host: GameHost;
  /** Current user's packet */
  currentPacket?: RedPacket;
  /** ID of the player who has the turn to pass */
  currentTurnPlayerId?: string;
  /** ID of the selected player to pass to (null if not selected) */
  selectedPlayerId?: string | null;
}

/**
 * Game phases
 */
export type GamePhase = "waiting" | "passing" | "revealing" | "elimination" | "ended";

/**
 * Reveal state of a pack in reveal phase
 */
export type PackRevealState = "pending" | "revealed-safe" | "revealed-exploded";

/**
 * Represents a player's pack during the reveal phase
 */
export interface RevealPackData {
  /** Unique identifier */
  id: string;
  /** Player who owns this pack */
  player: {
    id: string;
    name: string;
    seatNumber: number;
  };
  /** Current reveal state */
  revealState: PackRevealState;
  /** Pack number (shown when revealed) */
  packNumber?: number;
  /** Consolation prize amount (only for exploded packs) */
  consolationPrize?: string;
  /** Name of the player who passed the bomb (only for exploded packs) */
  trolledBy?: string;
  /** Pack illustration URL (only for revealed-safe packs) */
  imageUrl?: string;
}

/**
 * Selection state for pass target
 */
export interface PassSelection {
  /** ID of selected player to pass to */
  selectedPlayerId: string | null;
  /** Whether selection is confirmed/locked */
  isConfirmed: boolean;
}
