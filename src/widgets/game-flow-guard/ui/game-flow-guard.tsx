"use client";

import { useEffect, type PropsWithChildren } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { whitelistQueries } from "@/entities/whitelist";
import { gameQueries, GameStatus } from "@/entities/game";

type PlayerState =
  | "loading"
  | "not_connected"
  | "not_registered"
  | "name_required"
  | "registered"
  | "joined"
  | "selection" // STATUS_SELECTION (1)
  | "revealing" // STATUS_REVEALING (2)
  | "voting" // STATUS_VOTING (3)
  | "ended"; // STATUS_ENDED (4)

/**
 * GameFlowGuard - Routes players based on their game state
 *
 * State machine:
 * - not_connected → /invite-code (wallet required)
 * - not_registered → /invite-code (need to register)
 * - name_required → /invite-code (need to set display name)
 * - registered (not joined) → /landing (can join game)
 * - joined → /waiting-room (waiting for game to start)
 * - selection → /pass (selection phase)
 * - revealing → /reveal (bombs revealed)
 * - voting → /decision (players voting continue/stop)
 * - ended → /game-over (game finished)
 */
export function GameFlowGuard({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const { connected, account, isLoading: walletLoading } = useWallet();

  const address = account?.address?.toString();

  // Query invite code - only runs when address is available (enabled guards)
  const {
    data: inviteCode,
    isLoading: codeLoading,
    isError: codeError,
  } = useQuery({
    ...whitelistQueries.inviteCode(address!),
    enabled: !!address && connected,
    retry: false, // Error is expected state for new users
  });

  // Query if player has joined game (runs independently of inviteCode)
  const { data: hasJoined, isLoading: joinLoading } = useQuery({
    ...gameQueries.hasJoined(address!),
    enabled: !!address && connected,
    retry: false, // Error is expected if user hasn't joined
  });

  // Query if player has set pending name
  const { data: hasPendingName, isLoading: nameLoading } = useQuery({
    ...gameQueries.hasPendingName(address!),
    enabled: !!address && connected && !!inviteCode, // Only if registered
    retry: false,
  });

  // Query game status to detect when game starts
  const { data: gameState, isLoading: statusLoading } = useQuery({
    ...gameQueries.status(),
    enabled: hasJoined === true, // Only poll when player has joined
    refetchInterval: 2_000, // Poll every 2s to detect game start
  });

  // Determine player state
  // Priority: game phase > joined > registered > name_required > not_registered > not_connected
  const getPlayerState = (): PlayerState => {
    if (walletLoading) return "loading";
    if (!connected) return "not_connected";
    if (joinLoading || codeLoading) return "loading";

    // Check if already joined
    if (hasJoined === true) {
      if (statusLoading) return "loading";
      if (gameState) {
        switch (gameState.status) {
          case GameStatus.SELECTION:
            return "selection";
          case GameStatus.REVEALING:
            return "revealing";
          case GameStatus.VOTING:
            return "voting";
          case GameStatus.ENDED:
            return "ended";
          default:
            return "joined"; // PENDING
        }
      }
      return "joined";
    }

    if (codeError || !inviteCode) return "not_registered";

    // Check if name is set
    if (nameLoading) return "loading";
    if (!hasPendingName) return "name_required";

    return "registered";
  };

  const playerState = getPlayerState();

  // Get target route for current state
  const getTargetRoute = (state: PlayerState): string | null => {
    switch (state) {
      case "not_connected":
      case "not_registered":
      case "name_required":
        return "/invite-code";
      case "registered":
        return "/landing";
      case "joined":
        return "/waiting-room";
      case "selection":
        return "/pass";
      case "revealing":
        return "/reveal";
      case "voting":
        return "/decision";
      case "ended":
        return "/game-over";
      default:
        return null; // loading
    }
  };

  // Redirect if on wrong route
  useEffect(() => {
    if (playerState === "loading") return;

    const targetRoute = getTargetRoute(playerState);
    if (targetRoute && pathname !== targetRoute) {
      router.replace(targetRoute);
    }
  }, [playerState, pathname, router]);

  // Show loading while determining state
  if (playerState === "loading") {
    return (
      <div className="h-full flex items-center justify-center bg-[#fff7ed]">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-[#f54900] text-lg font-space">Loading...</p>
        </div>
      </div>
    );
  }

  // Render children only if on correct route
  const targetRoute = getTargetRoute(playerState);
  if (targetRoute && pathname !== targetRoute) {
    // Redirecting...
    return (
      <div className="h-full flex items-center justify-center bg-[#fff7ed]">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-[#f54900] text-lg font-space">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
