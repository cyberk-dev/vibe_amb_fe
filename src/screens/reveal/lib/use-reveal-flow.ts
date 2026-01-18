import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { gameQueries, formatAptAmount } from "@/entities/game";
import type { RevealPackData } from "@/entities/game";

interface UseRevealFlowReturn {
  packs: RevealPackData[];
  round: number;
  isCurrentUserVictim: boolean;
  isLoading: boolean;
}

export function useRevealFlow(): UseRevealFlowReturn {
  const { account } = useWallet();
  const address = account?.address?.toString();

  // Get game status for round number
  const { data: gameStatus, isLoading: statusLoading } = useQuery({
    ...gameQueries.status(),
    staleTime: 10_000,
  });

  // Get victims with seats - ALWAYS fetch fresh on mount
  const { data: victims = [], isLoading: victimsLoading } = useQuery({
    ...gameQueries.victimsWithNames(),
    staleTime: 0,
    refetchOnMount: "always",
  });

  // Get SURVIVOR players with seats - fetch fresh on mount
  const { data: survivors = [], isLoading: survivorsLoading } = useQuery({
    ...gameQueries.playersWithSeats(),
    staleTime: 0,
    refetchOnMount: "always",
    refetchInterval: false,
  });

  // Get consolation prize amount
  const { data: prizes } = useQuery({
    ...gameQueries.prizes(),
    staleTime: 10_000,
  });

  // Build packs: combine survivors and victims, sort by seat
  const packs: RevealPackData[] = [];

  // Add survivors as safe packs (using seat from contract)
  survivors.forEach((player) => {
    packs.push({
      id: player.address,
      player: {
        id: player.address,
        name: player.name,
        seatNumber: (player.seat ?? 0) + 1, // seat is 0-indexed
      },
      revealState: "revealed-safe",
      packNumber: (player.seat ?? 0) + 1,
    });
  });

  // Add victims as exploded packs (using seat from contract)
  const formattedPrize = prizes ? `+${formatAptAmount(prizes.consolationPrize)}` : "...";

  victims.forEach((victim) => {
    packs.push({
      id: victim.address,
      player: {
        id: victim.address,
        name: victim.name,
        seatNumber: victim.seat + 1, // seat is 0-indexed
      },
      revealState: "revealed-exploded",
      consolationPrize: formattedPrize,
    });
  });

  // Sort packs by seat number so everyone appears in original order
  packs.sort((a, b) => a.player.seatNumber - b.player.seatNumber);

  const victimAddresses = victims.map((v) => v.address);
  const isCurrentUserVictim = !!address && victimAddresses.includes(address);

  return {
    packs,
    round: gameStatus?.round ?? 1,
    isCurrentUserVictim,
    isLoading: statusLoading || victimsLoading || survivorsLoading,
  };
}
