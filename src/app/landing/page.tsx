"use client";

import { LandingScreen } from "@/screens/landing";

/**
 * Landing Page Route
 *
 * This page displays the game introduction (lore) and allows users to:
 * - Join matchmaking
 * - View game demo
 * - Check wallet/balance
 *
 * Prerequisites:
 * - User must be authenticated (wallet/Google)
 * - playerName should be available from auth context or session
 *
 * @see docs/prd.md for complete game flow
 */
export default function LandingPage() {
  // TODO: Get playerName from auth context or sessionStorage
  const playerName = "UserName"; // Placeholder

  const handleJoinMatchmaking = () => {
    // TODO: Navigate to lobby/queue
    console.log("Join matchmaking clicked");
  };

  const handleViewDemo = () => {
    // TODO: Navigate to demo/tutorial
    console.log("View demo clicked");
  };

  const handleViewWallet = () => {
    // TODO: Navigate to wallet/balance
    console.log("View wallet clicked");
  };

  return (
    <LandingScreen
      playerName={playerName}
      onJoinMatchmaking={handleJoinMatchmaking}
      onViewDemo={handleViewDemo}
      onViewWallet={handleViewWallet}
    />
  );
}
