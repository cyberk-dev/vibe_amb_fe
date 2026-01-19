"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/shared/lib/utils";
import type { GameHost } from "../model/types";

export interface GameHostBadgeProps extends React.ComponentPropsWithoutRef<"div"> {
  /**
   * Host/admin data
   */
  host: GameHost;
}

// Default avatar placeholder
const DEFAULT_AVATAR = "/images/avatar-placeholder.png";

/**
 * GameHostBadge - Displays the game host/admin with avatar and speech bubble
 *
 * Shows the admin's avatar, name, role, and optional speech bubble message.
 * Positioned in the top-right area of the game screen.
 *
 * @example
 * <GameHostBadge
 *   host={{
 *     name: "Mr. Horse",
 *     role: "Admin",
 *     avatarUrl: "/images/admin-avatar.png",
 *     message: "Make right decision..."
 *   }}
 * />
 */
export const GameHostBadge = React.forwardRef<HTMLDivElement, GameHostBadgeProps>(
  ({ host, className, ...props }, ref) => {
    const { name, role, avatarUrl } = host;

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        {/* Speech bubble (if message exists) */}
        {/* {message && (
          <div className="absolute right-[100px] top-[20px] bg-white border-2 border-black rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] px-4 py-2 max-w-[168px]">
            <p className="font-space text-[12px] font-normal leading-4 tracking-[1.2px] uppercase text-black">
              {message}
            </p>
          </div>
        )} */}

        {/* Avatar and info container */}
        <div className="flex flex-col items-end gap-2 hidden">
          {/* Avatar */}
          <div className="size-[80px] rounded-full border-2 border-custom-light-orange overflow-hidden relative">
            <Image
              src={avatarUrl || DEFAULT_AVATAR}
              alt={`${name}'s avatar`}
              fill
              className="object-cover"
              unoptimized // For external URLs
            />
          </div>

          {/* Name and role */}
          <div className="flex flex-col items-end">
            <p className="font-space text-[16px] font-medium leading-4 tracking-[1.2px] uppercase text-black">
              {name} - {role}
            </p>
          </div>
        </div>
      </div>
    );
  },
);

GameHostBadge.displayName = "GameHostBadge";
