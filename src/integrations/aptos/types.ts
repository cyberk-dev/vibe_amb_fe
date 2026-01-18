// Game status constants from contract
export enum GameStatus {
  PENDING = 0,
  SELECTION = 1,
  REVEALING = 2,
  VOTING = 3,
  ENDED = 4,
}

// Vote options
export enum Vote {
  STOP = 0,
  CONTINUE = 1,
}

// Common response wrapper for view functions
export interface ViewResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}
