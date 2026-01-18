import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { usePlayerRegistration, useClearPlayerRegistration } from "@/entities/player";
import { gameQueries } from "@/entities/game";
import { useJoinGame } from "@/features/join-game";

export type LandingFlowState = "loading" | "ready" | "joining" | "error";

export function useLandingFlow() {
  const router = useRouter();
  const { account, connected } = useWallet();
  const registration = usePlayerRegistration();
  const clearRegistration = useClearPlayerRegistration();

  const address = account?.address?.toString();

  // Check if player already joined game
  const { data: hasJoined, isLoading: checkingJoined } = useQuery({
    ...gameQueries.hasJoined(address ?? ""),
    enabled: !!address && connected,
  });

  const { mutateAsync: joinGame, isPending: isJoining, error } = useJoinGame();

  // Redirect if already joined
  useEffect(() => {
    if (hasJoined === true) {
      clearRegistration();
      router.replace("/waiting-room");
    }
  }, [hasJoined, clearRegistration, router]);

  // State machine
  const state: LandingFlowState = (() => {
    if (checkingJoined) return "loading";
    if (isJoining) return "joining";
    if (error) return "error";
    return "ready";
  })();

  const handleJoinMatchmaking = useCallback(async () => {
    if (!registration || hasJoined) return;

    try {
      await joinGame({
        code: registration.inviteCode,
        displayName: registration.displayName,
      });
      clearRegistration();
      router.push("/waiting-room");
    } catch {
      // Error handled by mutation
    }
  }, [registration, hasJoined, joinGame, clearRegistration, router]);

  return {
    state,
    playerName: registration?.displayName ?? "",
    isJoining: isJoining || checkingJoined,
    handleJoinMatchmaking,
  };
}
