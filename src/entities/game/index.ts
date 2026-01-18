// Game Entity - Public API
// Export only the types and components that should be used by other layers

// Types
export type { GamePlayer, GameHost, RedPacket, GameState, GamePhase, PassSelection } from "./model/types";

// UI Components
export { GamePlayerCard } from "./ui/game-player-card";
export type { GamePlayerCardProps, GamePlayerCardVariant } from "./ui/game-player-card";

export { RedPacketCard } from "./ui/red-packet-card";
export type { RedPacketCardProps } from "./ui/red-packet-card";

export { GameHostBadge } from "./ui/game-host-badge";
export type { GameHostBadgeProps } from "./ui/game-host-badge";
