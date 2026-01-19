import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Decimal from "decimal.js";
import { gameQueries, formatAptAmount } from "@/entities/game";
import { useVote } from "@/features/vote";
import { Vote } from "@/integrations/aptos";
import type { DecisionPlayer, EliminatedPlayer } from "@/widgets/decision/ui/decision-widget";

export function useDecisionFlow() {
  const { account } = useWallet();
  const address = account?.address?.toString();

  // Game status
  const { data: gameStatus } = useQuery({
    ...gameQueries.status(),
    refetchInterval: 5_000,
  });

  // Players with votes (single query for addresses, names, seats, hasVoted, vote)
  const { data: players = [], isLoading: playersLoading } = useQuery({
    ...gameQueries.playersWithVotes(),
  });

  // Victims (eliminated this round)
  const { data: victims = [] } = useQuery({
    ...gameQueries.victimsWithNames(),
    staleTime: 0,
    refetchOnMount: "always",
  });

  // Prizes
  const { data: prizes } = useQuery({
    ...gameQueries.prizes(),
    staleTime: 10_000,
  });

  // Vote mutation
  const { mutateAsync: vote, isPending: isVoting } = useVote();

  // Map players to DecisionPlayer format with vote status from contract
  const remainingPlayers: DecisionPlayer[] = players.map((p, index) => ({
    id: p.address,
    name: p.name,
    seatNumber: (p.seat ?? index) + 1,
    voteStatus: p.hasVoted ? (p.vote === Vote.STOP ? "share" : "continue") : "pending",
  }));

  // First victim as eliminated player (if any)
  const eliminatedPlayer: EliminatedPlayer | null =
    victims.length > 0
      ? {
          id: victims[0].address,
          name: victims[0].name,
          seatNumber: victims[0].seat + 1,
          consolationPrize: prizes ? Number(formatAptAmount(prizes.consolationPrize).replace(" APT", "")) : 0,
        }
      : null;

  // Calculate prize per player using Decimal for precision
  const remainingPool = prizes?.remainingPool ?? BigInt(0);
  const prizePerPlayer =
    players.length > 0 ? new Decimal(remainingPool.toString()).div(1e8).div(players.length).toFixed() : "0";

  // Current user's vote status from players data
  const currentPlayer = players.find((p) => p.address === address);
  const currentUserVote: "share" | "continue" | null = currentPlayer?.hasVoted
    ? currentPlayer.vote === Vote.STOP
      ? "share"
      : "continue"
    : null;

  // Vote counts from players data
  const voteCounts = players.reduce(
    (acc, p) => {
      if (p.hasVoted) {
        if (p.vote === Vote.STOP) {
          acc.share++;
        } else {
          acc.continue++;
        }
      }
      return acc;
    },
    { share: 0, continue: 0 },
  );

  // Vote handlers
  const handleVoteStop = async () => {
    await vote(Vote.STOP);
  };

  const handleVoteContinue = async () => {
    await vote(Vote.CONTINUE);
  };

  return {
    // Data
    round: gameStatus?.round ?? 1,
    remainingPlayers,
    eliminatedPlayer,
    prizePerPlayer,
    totalPool: new Decimal(remainingPool.toString()).div(1e8).toFixed(),
    nextRoundPool: 0,
    voteCounts,
    currentUserVote,

    // Actions
    onSharePrize: handleVoteStop,
    onContinuePlaying: handleVoteContinue,
    isVoting,

    // Loading
    isLoading: playersLoading,
  };
}
