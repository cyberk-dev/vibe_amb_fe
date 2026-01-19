"use client";

import { GameFlowGuard } from "@/widgets/game-flow-guard";
import { WaitingRoomScreen } from "@/screens/waiting-room";

/**
 * Waiting Room Page
 *
 * Route: /waiting-room
 *
 * Displays the matchmaking waiting room where players wait for 20 seats
 * to fill before the game starts. Includes a 60s countdown when full.
 */
export default function WaitingRoomPage() {
  return (
    <GameFlowGuard>
      <WaitingRoomScreen />
    </GameFlowGuard>
  );
}
