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
const DEFAULT_PACKET_IMAGE = "/packet.png";

/**
 * RedPacketCard - Displays a lucky money (lì xì) red packet
 *
 * Shows the red packet illustration filling the entire container.
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
        className={cn("w-[200px] h-[340px] md:w-[302px] md:h-[508px] overflow-hidden relative", className)}
        {...props}
      >
        {/* Packet illustration - covers entire container */}
        <Image
          src={imgSrc}
          alt={alt}
          fill
          className="object-cover"
          priority
          unoptimized // For external URLs
        />
      </div>
    );
  },
);

RedPacketCard.displayName = "RedPacketCard";
