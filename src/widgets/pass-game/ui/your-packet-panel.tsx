"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { FormattedMessage } from "react-intl";
import { cn } from "@/shared/lib/utils";
import type { RedPacket } from "@/entities/game";
import { RedPacketCard } from "@/entities/game";

// ========================================
// Animation Variants
// ========================================

const labelVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const packetVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
      delay: 0.1,
    },
  },
};

const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

interface YourPacketPanelProps {
  /**
   * The user's current red packet
   */
  packet?: RedPacket;
  /**
   * Image URL for the packet (overrides packet.imageUrl)
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
export function YourPacketPanel({ packet, className }: YourPacketPanelProps) {
  return (
    <motion.div className={cn("flex flex-col gap-4", className)} initial="hidden" animate="visible">
      {/* Label */}
      <motion.p
        className="font-space text-xs font-normal leading-4 tracking-[1.2px] uppercase text-[#6a7282]"
        variants={labelVariants}
      >
        <FormattedMessage id="pass_game.your_packet" defaultMessage="Your Packet" />
      </motion.p>

      {/* Red packet card */}
      <motion.div variants={packetVariants} whileInView={floatAnimation}>
        <RedPacketCard packet={packet} />
      </motion.div>
    </motion.div>
  );
}
