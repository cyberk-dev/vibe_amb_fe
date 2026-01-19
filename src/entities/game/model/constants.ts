import { GameStatus, Vote } from "@/integrations/aptos";

export const STATUS_LABELS: Record<GameStatus, string> = {
  [GameStatus.PENDING]: "Waiting for Players",
  [GameStatus.SELECTION]: "Selection Phase",
  [GameStatus.REVEALING]: "Revealing Bombs",
  [GameStatus.REVEALED]: "Bombs Revealed",
  [GameStatus.VOTING]: "Voting Phase",
  [GameStatus.ENDED]: "Game Ended",
};

export const STATUS_COLORS: Record<GameStatus, string> = {
  [GameStatus.PENDING]: "yellow",
  [GameStatus.SELECTION]: "blue",
  [GameStatus.REVEALING]: "orange",
  [GameStatus.REVEALED]: "red",
  [GameStatus.VOTING]: "purple",
  [GameStatus.ENDED]: "gray",
};

export const STATUS_DESCRIPTIONS: Record<GameStatus, string> = {
  [GameStatus.PENDING]: "Players can join the game. Waiting for admin to start.",
  [GameStatus.SELECTION]: "Players choose to keep or give their bao.",
  [GameStatus.REVEALING]: "Admin can reveal bombs and eliminate players.",
  [GameStatus.REVEALED]: "Bombs revealed. Players can see who was eliminated. Admin starts voting.",
  [GameStatus.VOTING]: "Survivors vote to continue or stop the game.",
  [GameStatus.ENDED]: "Game has finished. Winners can claim prizes.",
};

export const VOTE_LABELS: Record<Vote, string> = {
  [Vote.STOP]: "Stop & Split",
  [Vote.CONTINUE]: "Continue",
};

export const VOTE_COLORS: Record<Vote, string> = {
  [Vote.STOP]: "red",
  [Vote.CONTINUE]: "green",
};

// Admin actions available per status
export const ADMIN_ACTIONS_BY_STATUS: Record<GameStatus, string[]> = {
  [GameStatus.PENDING]: ["start_game"],
  [GameStatus.SELECTION]: ["finalize_selection"],
  [GameStatus.REVEALING]: ["reveal_bombs"],
  [GameStatus.REVEALED]: ["start_voting"],
  [GameStatus.VOTING]: ["finalize_voting"],
  [GameStatus.ENDED]: ["reset_game"],
};
