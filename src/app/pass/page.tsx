"use client";

import { GameFlowGuard } from "@/widgets/game-flow-guard";
import { PassScreen } from "@/screens/pass";

export default function PassPage() {
  return (
    <GameFlowGuard>
      <PassScreen />
    </GameFlowGuard>
  );
}
