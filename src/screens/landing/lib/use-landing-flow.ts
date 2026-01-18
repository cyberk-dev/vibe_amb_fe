import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { usePlayerRegistration, useClearPlayerRegistration } from "@/entities/player";
import { gameQueries } from "@/entities/game";
import { useJoinGame } from "@/features/join-game";

export type LandingFlowState = "ready" | "joining" | "error";

export function useLandingFlow() {
  const router = useRouter();
  const { account } = useWallet();
  const registration = usePlayerRegistration();
  const clearRegistration = useClearPlayerRegistration();

  const { mutateAsync: joinGame, isPending: isJoining, error } = useJoinGame();

  // Check if user has valid registration (guard already handles redirect)
  const hasValidRegistration = Boolean(
    registration?.inviteCode &&
      registration?.displayName &&
      registration.walletAddress === account?.address?.toString(),
  );

  // Determine state
  const getState = (): LandingFlowState => {
    if (isJoining) return "joining";
    if (error) return "error";
    return "ready";
  };

  const state = getState();

  // Fetch players count with polling (10s interval from gameQueries.status())
  const { data: gameStatus } = useQuery({
    ...gameQueries.status(),
    enabled: hasValidRegistration,
  });

  const handleJoinMatchmaking = useCallback(async () => {
    if (!registration) return;

    try {
      await joinGame({
        code: registration.inviteCode,
        displayName: registration.displayName,
      });
      clearRegistration(); // Clear after successful join
      router.push("/pass");
    } catch {
      // Error handled by mutation
    }
  }, [registration, joinGame, clearRegistration, router]);

  return {
    state,
    playerName: registration?.displayName ?? "",
    isJoining,
    handleJoinMatchmaking,
    playersCount: gameStatus?.playersCount ?? 0,
  };
}
