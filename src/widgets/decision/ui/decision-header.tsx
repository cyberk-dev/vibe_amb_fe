"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { Volume2, VolumeX } from "lucide-react";

interface DecisionHeaderProps {
  totalPlayers: number;
  isMuted: boolean;
  onToggleMute: () => void;
  className?: string;
}

/**
 * DecisionHeader - Header section with title and controls
 *
 * Shows:
 * - "CRITICAL DECISION" label
 * - "Decision" large title
 * - Player count badge
 * - Sound toggle button
 */
export function DecisionHeader({ totalPlayers, isMuted, onToggleMute, className }: DecisionHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between", className)}>
      {/* Left side - Title */}
      <div className="flex flex-col gap-4">
        <p className="font-space text-xs font-normal uppercase tracking-[3.6px] text-custom-teal">Critical Decision</p>
        <h1 className="font-bricolage text-[80px] md:text-[192px] font-bold leading-[0.85] text-black">Decision</h1>
      </div>

      {/* Right side - Controls */}
      <div className="flex items-center gap-4">
        {/* Player count badge */}
        <div className="h-12 border-2 border-custom-teal px-6 flex items-center">
          <span className="font-space text-sm font-medium text-custom-teal">{totalPlayers} Players</span>
        </div>

        {/* Sound toggle button */}
        <button
          type="button"
          onClick={onToggleMute}
          className="size-12 bg-custom-light-orange flex items-center justify-center hover:opacity-90 transition-opacity"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="size-6 text-white" /> : <Volume2 className="size-6 text-white" />}
        </button>
      </div>
    </div>
  );
}
