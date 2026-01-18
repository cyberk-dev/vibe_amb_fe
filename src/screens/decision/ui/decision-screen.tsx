"use client";

import { useState, useCallback, useMemo } from "react";
import { DecisionWidget } from "@/widgets/decision";
import type { DecisionPlayer, EliminatedPlayer } from "@/widgets/decision/ui/decision-widget";

/** Mock current user ID - in real app, get from auth */
const CURRENT_USER_ID = "5"; // Diana

/** Mock data for demonstration */
const MOCK_ELIMINATED_PLAYER: EliminatedPlayer = {
  id: "3",
  name: "Bob",
  seatNumber: 3,
  consolationPrize: 1,
};

const INITIAL_REMAINING_PLAYERS: DecisionPlayer[] = [
  { id: "1", name: "Manh", seatNumber: 1, voteStatus: "share" },
  { id: "2", name: "Alice", seatNumber: 2, voteStatus: "share" },
  { id: "4", name: "Charlie", seatNumber: 4, voteStatus: "continue" },
  { id: "5", name: "Diana", seatNumber: 5, voteStatus: "pending" },
  { id: "6", name: "Eve", seatNumber: 6, voteStatus: "pending" },
  { id: "7", name: "Frank", seatNumber: 7, voteStatus: "pending" },
  { id: "8", name: "Grace", seatNumber: 8, voteStatus: "pending" },
  { id: "9", name: "Henry", seatNumber: 9, voteStatus: "pending" },
  { id: "10", name: "Ivy", seatNumber: 10, voteStatus: "pending" },
  { id: "11", name: "Jack", seatNumber: 11, voteStatus: "pending" },
  { id: "12", name: "Kate", seatNumber: 12, voteStatus: "pending" },
  { id: "13", name: "Leo", seatNumber: 13, voteStatus: "pending" },
  { id: "14", name: "Maya", seatNumber: 14, voteStatus: "pending" },
  { id: "15", name: "Noah", seatNumber: 15, voteStatus: "pending" },
  { id: "16", name: "Olivia", seatNumber: 16, voteStatus: "pending" },
  { id: "17", name: "Peter", seatNumber: 17, voteStatus: "pending" },
  { id: "18", name: "Quinn", seatNumber: 18, voteStatus: "pending" },
  { id: "19", name: "Rose", seatNumber: 19, voteStatus: "pending" },
  { id: "20", name: "Sam", seatNumber: 20, voteStatus: "pending" },
];

const TOTAL_POOL = 28;
const NEXT_ROUND_POOL = 42;

/**
 * DecisionScreen - Screen for the voting/decision phase
 *
 * Features:
 * - Shows eliminated player with consolation prize
 * - Displays remaining players with vote status
 * - Two voting options: Share Prize vs Keep Playing
 * - Sound toggle
 *
 * Flow:
 * - After reveal phase, remaining players vote
 * - If ALL vote STOP → split prize equally
 * - If ANY vote CONTINUE → next round starts
 */
export function DecisionScreen() {
  const [currentUserVote, setCurrentUserVote] = useState<"share" | "continue" | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  // Update the current user's vote status in the players list
  const remainingPlayers = useMemo(() => {
    return INITIAL_REMAINING_PLAYERS.map((player) => {
      if (player.id === CURRENT_USER_ID && currentUserVote) {
        return { ...player, voteStatus: currentUserVote };
      }
      return player;
    });
  }, [currentUserVote]);

  // Calculate vote counts
  const voteCounts = useMemo(() => {
    return remainingPlayers.reduce(
      (acc, player) => {
        if (player.voteStatus === "share") acc.share++;
        if (player.voteStatus === "continue") acc.continue++;
        return acc;
      },
      { share: 0, continue: 0 },
    );
  }, [remainingPlayers]);

  const prizePerPlayer = TOTAL_POOL / remainingPlayers.length;

  const handleSharePrize = useCallback(async () => {
    setIsVoting(true);
    // TODO: Call vote mutation with Vote.STOP
    // await vote(Vote.STOP);
    setCurrentUserVote("share");
    setIsVoting(false);
  }, []);

  const handleContinuePlaying = useCallback(async () => {
    setIsVoting(true);
    // TODO: Call vote mutation with Vote.CONTINUE
    // await vote(Vote.CONTINUE);
    setCurrentUserVote("continue");
    setIsVoting(false);
  }, []);

  return (
    <DecisionWidget
      totalPlayers={remainingPlayers.length}
      eliminatedPlayer={MOCK_ELIMINATED_PLAYER}
      remainingPlayers={remainingPlayers}
      prizePerPlayer={prizePerPlayer}
      totalPool={TOTAL_POOL}
      nextRoundPool={NEXT_ROUND_POOL}
      voteCounts={voteCounts}
      onSharePrize={handleSharePrize}
      onContinuePlaying={handleContinuePlaying}
      isVoting={isVoting}
      currentUserVote={currentUserVote}
    />
  );
}
