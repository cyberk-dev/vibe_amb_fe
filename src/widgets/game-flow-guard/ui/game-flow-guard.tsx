"use client";

import { useEffect, type PropsWithChildren } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { whitelistQueries } from "@/entities/whitelist";
import { gameQueries } from "@/entities/game";

type PlayerState = "loading" | "not_connected" | "not_registered" | "registered" | "joined";

/**
 * GameFlowGuard - Routes players based on their game state
 *
 * State machine:
 * - not_connected → /invite-code (wallet required)
 * - not_registered → /invite-code (need to register)
 * - registered (not joined) → /landing (can join game)
 * - joined → /waiting-room (already in game)
 */
export function GameFlowGuard({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const { connected, account, isLoading: walletLoading } = useWallet();

  const address = account?.address?.toString();

  // Query invite code (error = not registered)
  const {
    data: inviteCode,
    isLoading: codeLoading,
    isError: codeError,
  } = useQuery({
    ...whitelistQueries.inviteCode(address ?? ""),
    enabled: !!address && connected,
  });

  // Query if player has joined game (runs independently of inviteCode)
  const { data: hasJoined, isLoading: joinLoading } = useQuery({
    ...gameQueries.hasJoined(address ?? ""),
    enabled: !!address && connected,
  });

  console.log(hasJoined);

  // Determine player state
  // Check hasJoined first - if already joined, go to waiting room
  const getPlayerState = (): PlayerState => {
    if (walletLoading) return "loading";
    if (!connected) return "not_connected";
    if (joinLoading || codeLoading) return "loading";
    if (hasJoined === true) return "joined";
    if (codeError || !inviteCode) return "not_registered";
    return "registered";
  };

  const playerState = getPlayerState();

  // Get target route for current state
  const getTargetRoute = (state: PlayerState): string | null => {
    switch (state) {
      case "not_connected":
      case "not_registered":
        return "/invite-code";
      case "registered":
        return "/landing";
      case "joined":
        return "/waiting-room";
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
