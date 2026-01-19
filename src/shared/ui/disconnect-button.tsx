"use client";

import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { cn } from "@/shared/lib/utils";
import { useHoverSound } from "@/shared/lib";

export interface DisconnectButtonProps {
  /**
   * Style variant for different backgrounds
   * - "light": For dark/saturated backgrounds (white icon, semi-transparent bg)
   * - "dark": For light backgrounds (dark/red icon)
   * @default "dark"
   */
  variant?: "light" | "dark";
  /**
   * Additional classes for container positioning
   */
  className?: string;
}

/**
 * Disconnect Button
 *
 * A reusable button component for disconnecting wallet and redirecting to invite-code screen.
 *
 * Features:
 * - Entrance animation (scale pop-in)
 * - Hover animation (scale up)
 * - Two style variants for different backgrounds
 * - Automatically disconnects wallet and redirects to /invite-code
 *
 * @example
 * ```tsx
 * // For dark/saturated backgrounds
 * <DisconnectButton variant="light" />
 *
 * // For light backgrounds
 * <DisconnectButton variant="dark" />
 * ```
 */
export function DisconnectButton({ variant = "dark", className }: DisconnectButtonProps) {
  const router = useRouter();
  const { disconnect, connected } = useWallet();
  const { onMouseEnter: playHoverSound } = useHoverSound();

  const handleDisconnect = async () => {
    await disconnect();
    router.push("/invite-code");
  };

  // Only show when wallet is connected
  if (!connected) {
    return null;
  }

  const iconColor = variant === "light" ? "text-white" : "text-custom-vivid-red";
  const bgColor =
    variant === "light"
      ? "bg-white/20 border-2 border-white hover:bg-white/30"
      : "bg-white border-2 border-custom-vivid-red/30 hover:border-custom-vivid-red/50";

  return (
    <motion.div
      className={cn("rounded-lg p-2 z-20", bgColor, className)}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        opacity: { delay: 0.5, duration: 0.3 },
        scale: { type: "spring" as const, stiffness: 300, damping: 20 },
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={playHoverSound}
    >
      <button
        type="button"
        className="w-6 h-6 flex items-center justify-center cursor-pointer"
        aria-label="Disconnect wallet"
        onClick={handleDisconnect}
      >
        <LogOut className={cn("w-6 h-6", iconColor)} />
      </button>
    </motion.div>
  );
}
