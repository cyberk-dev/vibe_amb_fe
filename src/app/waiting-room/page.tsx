"use client";

import { GameFlowGuard } from "@/widgets/game-flow-guard";
import { WaitingRoomScreen } from "@/screens/waiting-room";

/**
 * Waiting Room Page
 *
 * Route: /waiting-room
 *
 * Displays the matchmaking waiting room where players join until
 * the countdown starts. Includes a 60s countdown after the minimum is met.
 */
export default function WaitingRoomPage() {
  return (
    <GameFlowGuard>
      <WaitingRoomScreen />
    </GameFlowGuard>
  );
}
