// Pass to Player Feature - Types

/**
 * Payload for passing packet to another player
 */
export interface PassToPlayerPayload {
  /** ID of the game/session */
  gameId: string;
  /** ID of the player passing the packet (current user) */
  fromPlayerId: string;
  /** ID of the target player to receive the packet */
  toPlayerId: string;
}

/**
 * Response from pass action
 */
export interface PassToPlayerResponse {
  /** Whether the pass was successful */
  success: boolean;
  /** Message from server */
  message?: string;
}
