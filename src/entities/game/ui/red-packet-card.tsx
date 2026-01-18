"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/shared/lib/utils";
import type { RedPacket as RedPacketType } from "../model/types";

export interface RedPacketCardProps extends React.ComponentPropsWithoutRef<"div"> {
  /**
   * Red packet data (optional, will use default illustration if not provided)
   */
  packet?: RedPacketType;
  /**
   * Image URL for the packet illustration
   * Falls back to a placeholder if not provided
   */
  imageUrl?: string;
  /**
   * Alt text for the image
   */
  alt?: string;
}

// Default placeholder image for red packet
const DEFAULT_PACKET_IMAGE = "/images/red-packet-placeholder.png";

/**
 * RedPacketCard - Displays a lucky money (lì xì) red packet
 *
 * Shows the red packet illustration with an orange border frame.
 * Used in the pass game to display the user's current packet.
 *
 * @example
 * <RedPacketCard imageUrl="/images/red-packet.png" />
 */
export const RedPacketCard = React.forwardRef<HTMLDivElement, RedPacketCardProps>(
  ({ packet, imageUrl, alt = "Lucky Money Packet", className, ...props }, ref) => {
    const imgSrc = imageUrl || packet?.imageUrl || DEFAULT_PACKET_IMAGE;

    return (
      <div
        ref={ref}
        className={cn(
          "w-[302px] h-[508px] bg-white border-2 border-custom-light-orange overflow-hidden relative",
          className,
        )}
        {...props}
      >
        {/* Packet illustration */}
        <div className="absolute inset-0">
          <Image
            src={imgSrc}
            alt={alt}
            fill
            className="object-cover"
            priority
            unoptimized // For external URLs
          />
        </div>
      </div>
    );
  },
);

RedPacketCard.displayName = "RedPacketCard";
