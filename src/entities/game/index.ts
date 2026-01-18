// Game Entity - Public API
// Export only the types and components that should be used by other layers

// === Admin Dashboard Types (from Aptos contract) ===
// Queries
export { gameQueries } from "./api/game.queries";

// Types for admin dashboard
export type { Player, PlayerWithVote, AdminGameState, VotingState, RoundPrizes, GameOverview } from "./model/types";
export { GameStatus, Vote } from "./model/types";

// Constants
export {
  STATUS_LABELS,
  STATUS_COLORS,
  STATUS_DESCRIPTIONS,
  VOTE_LABELS,
  VOTE_COLORS,
  ADMIN_ACTIONS_BY_STATUS,
} from "./model/constants";

// Utils
export { formatAptAmount, truncateAddress } from "./lib/mappers";

// UI Components for admin
export { GameStatusBadge } from "./ui/game-status-badge";
export { PlayerStatusIndicator } from "./ui/player-status-indicator";
export { PlayerListItem } from "./ui/player-list-item";

// === Game UI Types (for player-facing game) ===
export type {
  GamePlayer,
  GameHost,
  RedPacket,
  GameState,
  GamePhase,
  PassSelection,
  PackRevealState,
  RevealPackData,
} from "./model/types";

// UI Components for game
export { GamePlayerCard } from "./ui/game-player-card";
export type { GamePlayerCardProps, GamePlayerCardVariant } from "./ui/game-player-card";

export { RedPacketCard } from "./ui/red-packet-card";
export type { RedPacketCardProps } from "./ui/red-packet-card";

export { GameHostBadge } from "./ui/game-host-badge";
export type { GameHostBadgeProps } from "./ui/game-host-badge";

export { RevealPackCard } from "./ui/reveal-pack-card";
export type { RevealPackCardProps } from "./ui/reveal-pack-card";
