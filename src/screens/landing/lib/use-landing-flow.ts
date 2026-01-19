import { useCallback } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { gameQueries, formatAptAmount } from "@/entities/game";
import { whitelistQueries } from "@/entities/whitelist";
import { vaultQueries } from "@/entities/vault";
import { useJoinGame } from "@/features/join-game";
import { useClaimPrize } from "@/features/claim-prize";

export type LandingFlowState = "loading" | "ready" | "joining" | "error";

export function useLandingFlow() {
  const { account, connected } = useWallet();

  const address = account?.address?.toString();

  // Get invite code from contract
  const { data: inviteCode, isLoading: codeLoading } = useQuery({
    ...whitelistQueries.inviteCode(address ?? ""),
    enabled: !!address && connected,
  });

  // Get pending name from contract
  const { data: playerName, isLoading: nameLoading } = useQuery({
    ...gameQueries.pendingName(address ?? ""),
    enabled: !!address && connected,
  });

  // Check if player already joined game
  const { data: hasJoined, isLoading: checkingJoined } = useQuery({
    ...gameQueries.hasJoined(address ?? ""),
    enabled: !!address && connected,
  });

  // Check for unclaimed prizes
  const { data: claimableBalance = BigInt(0) } = useQuery({
    ...vaultQueries.claimable(address ?? ""),
    enabled: !!address && connected,
  });

  const { mutateAsync: joinGame, isPending: isJoining, error } = useJoinGame();
  const { mutateAsync: claimPrize, isPending: isClaiming } = useClaimPrize();

  // Derived state
  const hasClaimable = claimableBalance > BigInt(0);
  const claimableFormatted = formatAptAmount(claimableBalance);

  // State machine
  const state: LandingFlowState = (() => {
    if (checkingJoined || codeLoading || nameLoading) return "loading";
    if (isJoining) return "joining";
    if (error) return "error";
    return "ready";
  })();

  const handleJoinMatchmaking = useCallback(async () => {
    if (!inviteCode || hasJoined) return;

    try {
      await joinGame({ code: inviteCode });
      // Guard will detect hasJoined → navigate to /waiting-room
    } catch {
      // Error handled by mutation
    }
  }, [inviteCode, hasJoined, joinGame]);

  const handleClaimPrize = useCallback(async () => {
    if (!hasClaimable) return;
    try {
      await claimPrize();
    } catch {
      // Error handled by mutation
    }
  }, [hasClaimable, claimPrize]);

  return {
    state,
    playerName: playerName ?? "",
    isJoining: isJoining || checkingJoined,
    handleJoinMatchmaking,
    // Claim prize
    hasClaimable,
    claimableFormatted,
    isClaiming,
    handleClaimPrize,
  };
}
