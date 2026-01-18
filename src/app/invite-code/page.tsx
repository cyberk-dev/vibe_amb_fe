"use client";

import { GameFlowGuard } from "@/widgets/game-flow-guard";
import { InviteCodeScreen } from "@/screens/invite-code";

/**
 * Invite Code Page Route
 *
 * Entry point for new users:
 * - Connect wallet (Aptos Connect / Google)
 * - Auto-register in whitelist → code is auto-generated
 * - Enter display name
 * - Continue → navigate to /landing
 *
 * GameFlowGuard redirects:
 * - Already registered → /landing
 * - Already joined game → /waiting-room
 */
export default function InviteCodePage() {
  return (
    <GameFlowGuard>
      <InviteCodeScreen />
    </GameFlowGuard>
  );
}
