import { GameStatus, Vote } from "@/integrations/aptos";

export interface Player {
  address: string;
  hasActed: boolean;
}

export interface PlayerWithVote extends Player {
  hasVoted: boolean;
  vote?: Vote;
}

export interface GameState {
  status: GameStatus;
  round: number;
  playersCount: number;
  eliminationCount: number;
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

export interface GameOverview extends GameState {
  prizes: RoundPrizes;
  players: Player[];
  voting?: VotingState;
  victims?: string[];
}

// Re-export for convenience
export { GameStatus, Vote };
