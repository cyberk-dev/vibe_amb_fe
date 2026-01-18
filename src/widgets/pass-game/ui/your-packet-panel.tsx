"use client";

import * as React from "react";
import { FormattedMessage } from "react-intl";
import { cn } from "@/shared/lib/utils";
import type { RedPacket } from "@/entities/game";
import { RedPacketCard } from "@/entities/game";

interface YourPacketPanelProps {
  /**
   * The user's current red packet
   */
  packet?: RedPacket;
  /**
   * Image URL for the packet (overrides packet.imageUrl)
   */
  imageUrl?: string;
  /**
   * Additional classes for container
   */
  className?: string;
}

/**
 * YourPacketPanel - Left panel showing the user's red packet
 *
 * Displays:
 * - "YOUR PACKET" label
 * - Red packet illustration card
 */
export function YourPacketPanel({ packet, imageUrl, className }: YourPacketPanelProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Label */}
      <p className="font-space text-xs font-normal leading-4 tracking-[1.2px] uppercase text-custom-dark-grayish-blue">
        <FormattedMessage id="pass_game.your_packet" defaultMessage="Your Packet" />
      </p>

      {/* Red packet card */}
      <RedPacketCard packet={packet} imageUrl={imageUrl} />
    </div>
  );
}
