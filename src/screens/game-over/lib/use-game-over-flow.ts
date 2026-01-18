import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { gameQueries, formatAptAmount, type LeaderboardPlayer } from "@/entities/game";
import { useClaimPrize } from "@/features/claim-prize";

export interface GameOverPlayer {
  rank: number;
  address: string;
  name: string;
  seatNumber: number;
  isEliminated: boolean;
  prize: string;
}

export function useGameOverFlow() {
  const { account } = useWallet();
  const address = account?.address?.toString();

  // Get all participants with their prizes
  const { data: leaderboard = [], isLoading } = useQuery(gameQueries.leaderboard());

  // Claim mutation
  const { mutateAsync: claim, isPending: isClaiming } = useClaimPrize();

  // Build standings: survivors first (sorted by seat), then eliminated
  const survivors = leaderboard.filter((p) => !p.isEliminated);
  const eliminated = leaderboard.filter((p) => p.isEliminated);

  const standings: GameOverPlayer[] = [
    ...survivors.map((p, i) => ({
      rank: i + 1,
      address: p.address,
      name: p.name,
      seatNumber: p.seat + 1,
      isEliminated: false,
      prize: formatAptAmount(p.prize),
    })),
    ...eliminated.map((p, i) => ({
      rank: survivors.length + i + 1,
      address: p.address,
      name: p.name,
      seatNumber: p.seat + 1,
      isEliminated: true,
      prize: formatAptAmount(p.prize),
    })),
  ];

  // Calculate total pool from all prizes
  const totalPool = leaderboard.reduce((sum, p) => sum + p.prize, BigInt(0));

  // Get current user's claimable from leaderboard
  const currentUserPlayer = leaderboard.find((p) => p.address === address);
  const claimable = currentUserPlayer?.prize ?? BigInt(0);
  const hasClaimable = claimable > BigInt(0);

  // Get winner (first survivor)
  const winner = standings.find((p) => !p.isEliminated) ?? standings[0];

  return {
    standings,
    winner,
    totalPool: formatAptAmount(totalPool),
    claimable: formatAptAmount(claimable),
    hasClaimable,
    currentUserAddress: address,
    onClaim: claim,
    isClaiming,
    isLoading,
  };
}
