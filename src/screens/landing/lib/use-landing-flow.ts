import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { usePlayerRegistration, useClearPlayerRegistration } from "@/entities/player";
import { gameQueries } from "@/entities/game";
import { useJoinGame } from "@/features/join-game";

export type LandingFlowState = "loading" | "no_registration" | "ready" | "joining" | "error";

export function useLandingFlow() {
  const router = useRouter();
  const { connected, account } = useWallet();
  const registration = usePlayerRegistration();
  const clearRegistration = useClearPlayerRegistration();

  const { mutateAsync: joinGame, isPending: isJoining, error } = useJoinGame();

  // Check if user has valid registration
  const hasValidRegistration = Boolean(
    registration?.inviteCode &&
      registration?.displayName &&
      registration.walletAddress === account?.address?.toString(),
  );

  // Redirect if no registration
  useEffect(() => {
    if (!connected) return;
    if (!hasValidRegistration) {
      router.push("/invite-code");
    }
  }, [connected, hasValidRegistration, router]);

  // Determine state
  const getState = (): LandingFlowState => {
    if (!connected) return "loading";
    if (!hasValidRegistration) return "no_registration";
    if (isJoining) return "joining";
    if (error) return "error";
    return "ready";
  };

  const state = getState();

  // Fetch players count with polling (10s interval from gameQueries.status())
  const { data: gameStatus } = useQuery({
    ...gameQueries.status(),
    enabled: state !== "loading",
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
