"use client";

import { useRouter } from "next/navigation";
import { GameOverScreen, useGameOverFlow } from "@/screens/game-over";
import { FullScreenLoader } from "@/shared/ui";

/**
 * Game Over Page Route
 *
 * This page displays the final results when a game ends:
 * - Winner announcement
 * - Total winnings
 * - Final standings of all players
 * - Claim prize functionality
 * - Navigation back to home
 *
 * @see docs/prd.md for complete game flow
 */
export default function GameOverPage() {
  const router = useRouter();
  const flow = useGameOverFlow();

  const handleBackToHome = () => {
    router.push("/landing");
  };

  if (flow.isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <GameOverScreen
      winner={flow.winner}
      totalPool={flow.totalPool}
      standings={flow.standings}
      claimable={flow.claimable}
      hasClaimable={flow.hasClaimable}
      onClaim={flow.onClaim}
      isClaiming={flow.isClaiming}
      onBackToHome={handleBackToHome}
    />
  );
}
