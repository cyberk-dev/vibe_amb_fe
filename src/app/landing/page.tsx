"use client";

import { RegistrationGuard } from "@/shared";
import { LandingScreen } from "@/screens/landing";

/**
 * Landing Page Route
 *
 * This page displays the game introduction (lore) and allows users to:
 * - Join matchmaking (calls join_game with registration data from store)
 * - View game demo
 * - Check wallet/balance
 *
 * Prerequisites:
 * - User must have completed registration at /invite-code
 * - Registration data (inviteCode, displayName, walletAddress) stored in Zustand store
 *
 * Flow:
 * - User arrives from /invite-code with registration in store
 * - Click "Join Matchmaking" → join_game(code, displayName) → /pass
 *
 * @see docs/prd.md for complete game flow
 */
export default function LandingPage() {
  return (
    <RegistrationGuard>
      <LandingScreen />
    </RegistrationGuard>
  );
}
