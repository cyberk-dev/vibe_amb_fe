import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePlayerRegistration, useClearPlayerRegistration } from "@/entities/player";
import { useJoinGame } from "@/features/join-game";

export type LandingFlowState = "ready" | "joining" | "error";

export function useLandingFlow() {
  const router = useRouter();
  const registration = usePlayerRegistration();
  const clearRegistration = useClearPlayerRegistration();

  const { mutateAsync: joinGame, isPending: isJoining, error } = useJoinGame();

  // Determine state
  const getState = (): LandingFlowState => {
    if (isJoining) return "joining";
    if (error) return "error";
    return "ready";
  };

  const state = getState();

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
  };
}
