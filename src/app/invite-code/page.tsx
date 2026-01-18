"use client";

import { GameFlowGuard } from "@/widgets/game-flow-guard";
import { InviteCodeScreen } from "@/screens/invite-code";

export default function InviteCodePage() {
  return (
    <GameFlowGuard>
      <InviteCodeScreen />
    </GameFlowGuard>
  );
}
