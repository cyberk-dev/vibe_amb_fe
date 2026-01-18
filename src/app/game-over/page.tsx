"use client";

import { useRouter } from "next/navigation";
import { GameOverScreen } from "@/screens/game-over";

/**
 * Game Over Page Route
 *
 * This page displays the final results when a game ends:
 * - Winner announcement
 * - Total winnings
 * - Final standings of all players
 * - Navigation back to home
 *
 * @see docs/prd.md for complete game flow
 */
export default function GameOverPage() {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push("/landing");
  };

  // Mock game results for testing (matching PassScreen fake players)
  const mockGameResults = {
    winner: {
      name: "Manh",
      playerLabel: "Player 1",
      rank: 1,
      winnings: 1.47,
    },
    totalWinnings: 175.0,
    standings: [
      { rank: 1, name: "Manh", playerLabel: "Player 1", winnings: 175.0 },
      { rank: 2, name: "Alex", playerLabel: "Player 2", winnings: 1.47 },
      { rank: 3, name: "Sarah", playerLabel: "Player 3", winnings: 1.47 },
      { rank: 4, name: "John", playerLabel: "Player 4", winnings: 1.47 },
      { rank: 5, name: "Emily", playerLabel: "Player 5", winnings: 1.47 },
      { rank: 6, name: "David", playerLabel: "Player 6", winnings: 1.47 },
      { rank: 7, name: "Lisa", playerLabel: "Player 7", winnings: 1.47 },
      { rank: 8, name: "Mike", playerLabel: "Player 8", winnings: 1.47 },
      { rank: 9, name: "Anna", playerLabel: "Player 9", winnings: 1.47 },
      { rank: 10, name: "Chris", playerLabel: "Player 10", winnings: 1.47 },
      { rank: 11, name: "Emma", playerLabel: "Player 11", winnings: 1.47 },
      { rank: 12, name: "James", playerLabel: "Player 12", winnings: 1.47 },
      { rank: 13, name: "Olivia", playerLabel: "Player 13", winnings: 1.47 },
      { rank: 14, name: "Daniel", playerLabel: "Player 14", winnings: 1.47 },
      { rank: 15, name: "Sophia", playerLabel: "Player 15", winnings: 1.47 },
      { rank: 16, name: "William", playerLabel: "Player 16", winnings: 1.47 },
      { rank: 17, name: "Ava", playerLabel: "Player 17", winnings: 1.47 },
      { rank: 18, name: "Joseph", playerLabel: "Player 18", winnings: 1.47 },
      { rank: 19, name: "Mia", playerLabel: "Player 19", winnings: 1.47 },
      { rank: 20, name: "Thomas", playerLabel: "Player 20", winnings: 1.0, isOut: true },
    ],
  };

  return (
    <GameOverScreen
      winner={mockGameResults.winner}
      totalWinnings={mockGameResults.totalWinnings}
      standings={mockGameResults.standings}
      onBackToHome={handleBackToHome}
    />
  );
}
