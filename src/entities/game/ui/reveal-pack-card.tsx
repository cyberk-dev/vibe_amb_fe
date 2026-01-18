"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/shared/lib/utils";
import type { RevealPackData, PackRevealState } from "../model/types";

export interface RevealPackCardProps extends React.ComponentPropsWithoutRef<"div"> {
  /**
   * Pack data containing player info and reveal state
   */
  pack: RevealPackData;
  /**
   * Size variant
   * - "sm": Compact size for grid display (mobile)
   * - "md": Medium size
   * - "lg": Large size for featured display
   */
  size?: "sm" | "md" | "lg";
  /**
   * Whether to show player header
   * @default true
   */
  showHeader?: boolean;
}

// Size configurations
const sizeConfig = {
  sm: {
    wrapper: "w-[106px]",
    header: "h-[41px] px-2 py-2",
    headerBadge: "size-6 text-[10px]",
    headerName: "text-[10px]",
    packContainer: "h-[124px]",
    packContent: "p-[6px]",
    packInner: "h-[112px]",
    pendingText: "text-[10px]",
    explodedEmoji: "text-[30px]",
    explodedBoom: "text-[9px]",
    explodedPrize: "text-[8px]",
  },
  md: {
    wrapper: "w-[140px]",
    header: "h-[52px] px-3 py-2",
    headerBadge: "size-8 text-[13px]",
    headerName: "text-[13px]",
    packContainer: "h-[160px]",
    packContent: "p-2",
    packInner: "h-[144px]",
    pendingText: "text-[13px]",
    explodedEmoji: "text-[40px]",
    explodedBoom: "text-[12px]",
    explodedPrize: "text-[10px]",
  },
  lg: {
    wrapper: "w-[220px]",
    header: "h-[64px] px-4 py-3",
    headerBadge: "size-10 text-base",
    headerName: "text-base",
    packContainer: "h-[280px]",
    packContent: "p-3",
    packInner: "h-[254px]",
    pendingText: "text-lg",
    explodedEmoji: "text-[60px]",
    explodedBoom: "text-base",
    explodedPrize: "text-sm",
  },
};

// Default placeholder image for revealed packs
const DEFAULT_PACK_IMAGE = "/images/red-packet-placeholder.png";

/**
 * RevealPackCard - Displays a player's pack during the reveal phase
 *
 * Has three visual states:
 * - **pending**: Pack not yet revealed, shows "?" placeholder
 * - **revealed-safe**: Pack revealed safely, shows pack illustration with number
 * - **revealed-exploded**: Pack exploded, shows red background with BOOM! and consolation prize
 *
 * @example
 * // Pending pack (not revealed yet)
 * <RevealPackCard
 *   pack={{
 *     id: "1",
 *     player: { id: "p1", name: "Maya", seatNumber: 14 },
 *     revealState: "pending",
 *   }}
 * />
 *
 * @example
 * // Revealed safe pack
 * <RevealPackCard
 *   pack={{
 *     id: "2",
 *     player: { id: "p2", name: "Manh", seatNumber: 1 },
 *     revealState: "revealed-safe",
 *     packNumber: 4,
 *     imageUrl: "/images/pack.png",
 *   }}
 * />
 *
 * @example
 * // Exploded pack
 * <RevealPackCard
 *   pack={{
 *     id: "3",
 *     player: { id: "p3", name: "Alice", seatNumber: 2 },
 *     revealState: "revealed-exploded",
 *     consolationPrize: "+$1",
 *     trolledBy: "Anderson",
 *   }}
 * />
 */
export const RevealPackCard = React.forwardRef<HTMLDivElement, RevealPackCardProps>(
  ({ pack, size = "sm", showHeader = true, className, ...props }, ref) => {
    const { player, revealState, packNumber, consolationPrize, trolledBy, imageUrl } = pack;
    const config = sizeConfig[size];

    const isExploded = revealState === "revealed-exploded";
    const isPending = revealState === "pending";
    const isRevealedSafe = revealState === "revealed-safe";

    return (
      <div ref={ref} className={cn("flex flex-col gap-2", config.wrapper, className)} {...props}>
        {/* Player header */}
        {showHeader && <PlayerHeader player={player} revealState={revealState} config={config} />}

        {/* Pack content */}
        <PackContent
          revealState={revealState}
          packNumber={packNumber}
          consolationPrize={consolationPrize}
          trolledBy={trolledBy}
          imageUrl={imageUrl}
          config={config}
          isPending={isPending}
          isExploded={isExploded}
          isRevealedSafe={isRevealedSafe}
        />
      </div>
    );
  },
);

RevealPackCard.displayName = "RevealPackCard";

// ============================================================================
// Sub-components
// ============================================================================

interface PlayerHeaderProps {
  player: RevealPackData["player"];
  revealState: PackRevealState;
  config: (typeof sizeConfig)["sm"];
}

function PlayerHeader({ player, revealState, config }: PlayerHeaderProps) {
  const isExploded = revealState === "revealed-exploded";
  const isPending = revealState === "pending";

  return (
    <div
      className={cn(
        "flex items-center gap-[6px] border",
        config.header,
        // Background and border colors based on state
        isExploded
          ? "bg-destructive border-destructive"
          : isPending
            ? "bg-white border-black/20"
            : "bg-white border-custom-very-dark-blue",
      )}
    >
      {/* Seat number badge */}
      <div
        className={cn(
          "flex items-center justify-center shrink-0",
          config.headerBadge,
          isExploded ? "bg-white text-destructive" : "bg-black text-white",
        )}
      >
        <span className="font-space font-bold">{player.seatNumber}</span>
      </div>

      {/* Player name */}
      <span
        className={cn("font-space font-bold truncate", config.headerName, isExploded ? "text-white" : "text-black")}
      >
        {player.name}
      </span>
    </div>
  );
}

interface PackContentProps {
  revealState: PackRevealState;
  packNumber?: number;
  consolationPrize?: string;
  trolledBy?: string;
  imageUrl?: string;
  config: (typeof sizeConfig)["sm"];
  isPending: boolean;
  isExploded: boolean;
  isRevealedSafe: boolean;
}

function PackContent({
  revealState,
  packNumber,
  consolationPrize,
  trolledBy,
  imageUrl,
  config,
  isPending,
  isExploded,
  isRevealedSafe,
}: PackContentProps) {
  return (
    <div
      className={cn(
        "w-full border",
        config.packContainer,
        // Background and border based on state
        isExploded
          ? "bg-white border-destructive border-2"
          : isPending
            ? "bg-white/50 border-black/20"
            : "bg-white border-custom-very-dark-blue border-2",
      )}
    >
      <div className={cn("h-full", config.packContent)}>
        {isPending && <PendingState config={config} />}
        {isRevealedSafe && <RevealedSafeState imageUrl={imageUrl} packNumber={packNumber} config={config} />}
        {isExploded && <ExplodedState consolationPrize={consolationPrize} trolledBy={trolledBy} config={config} />}
      </div>
    </div>
  );
}

interface PendingStateProps {
  config: (typeof sizeConfig)["sm"];
}

function PendingState({ config }: PendingStateProps) {
  return (
    <div className="size-full flex items-center justify-center bg-black/5">
      <span className={cn("font-space font-normal text-black/30 uppercase", config.pendingText)}>?</span>
    </div>
  );
}

interface RevealedSafeStateProps {
  imageUrl?: string;
  packNumber?: number;
  config: (typeof sizeConfig)["sm"];
}

function RevealedSafeState({ imageUrl, packNumber, config }: RevealedSafeStateProps) {
  const imgSrc = imageUrl || DEFAULT_PACK_IMAGE;

  return (
    <div className={cn("relative size-full overflow-hidden", config.packInner)}>
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src={imgSrc}
          alt="Lucky Pack"
          fill
          className="object-cover opacity-80"
          unoptimized // For external URLs
        />
        <div className="absolute inset-0 bg-custom-light-orange/20" />
      </div>

      {/* Pack number overlay (if provided) */}
      {packNumber !== undefined && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bricolage font-light text-white text-[80px] leading-none tracking-[0.225px] uppercase drop-shadow-lg">
            {packNumber}
          </span>
        </div>
      )}
    </div>
  );
}

interface ExplodedStateProps {
  consolationPrize?: string;
  trolledBy?: string;
  config: (typeof sizeConfig)["sm"];
}

function ExplodedState({ consolationPrize, trolledBy, config }: ExplodedStateProps) {
  return (
    <div className="size-full bg-destructive flex flex-col items-center justify-center gap-2">
      {/* Explosion emoji */}
      <span className={cn("leading-none", config.explodedEmoji)}>💥</span>

      {/* BOOM text */}
      <span className={cn("font-space font-bold text-white uppercase", config.explodedBoom)}>BOOM!</span>

      {/* Consolation prize */}
      {consolationPrize && (
        <span className={cn("font-space font-normal text-white/80", config.explodedPrize)}>{consolationPrize}</span>
      )}

      {/* Trolled by message */}
      {trolledBy && (
        <span className={cn("font-space font-normal text-white/80 text-center", config.explodedPrize)}>
          Trolled by {trolledBy}
        </span>
      )}
    </div>
  );
}
