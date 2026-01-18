"use client";

import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { useSoundToggle } from "@/shared/lib/stores";

export interface SoundButtonProps {
  /**
   * Whether sound is muted (optional - uses global store if not provided)
   */
  isMuted?: boolean;
  /**
   * Callback when sound button is clicked (optional - uses global store if not provided)
   */
  onToggle?: () => void;
  /**
   * Style variant for different backgrounds
   * - "light": For dark backgrounds (white/light icon)
   * - "dark": For light backgrounds (dark/red icon)
   * @default "dark"
   */
  variant?: "light" | "dark";
  /**
   * Additional classes for container positioning (e.g., "absolute top-6 right-6")
   */
  className?: string;
}

/**
 * Sound Toggle Button
 *
 * A reusable button component for toggling sound on/off with built-in animations.
 * Displays VolumeX icon when muted, Volume2 icon when unmuted.
 *
 * Features:
 * - Entrance animation (scale pop-in)
 * - Hover animation (scale up)
 * - Two style variants for different backgrounds
 * - Uses global audio store by default
 *
 * Can be used in two modes:
 * 1. Controlled: Pass isMuted and onToggle props
 * 2. Global: Uses the global audio store (default)
 *
 * @example
 * ```tsx
 * // Using global store with light variant (for dark backgrounds)
 * <SoundButton variant="light" className="absolute top-6 right-6" />
 *
 * // Using global store with dark variant (for light backgrounds)
 * <SoundButton variant="dark" className="absolute top-6 right-6" />
 *
 * // Controlled mode
 * const [isMuted, setIsMuted] = useState(false);
 * <SoundButton isMuted={isMuted} onToggle={() => setIsMuted(!isMuted)} />
 * ```
 */
export function SoundButton({
  isMuted: controlledMuted,
  onToggle: controlledToggle,
  variant = "dark",
  className,
}: SoundButtonProps) {
  const { isMuted: globalMuted, toggleMute: globalToggle } = useSoundToggle();

  // Use controlled props if provided, otherwise use global store
  const isMuted = controlledMuted ?? globalMuted;
  const onToggle = controlledToggle ?? globalToggle;

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
    >
      <button
        type="button"
        className="w-6 h-6 flex items-center justify-center cursor-pointer"
        aria-label="Toggle sound"
        onClick={onToggle}
      >
        {isMuted ? <VolumeX className={cn("w-6 h-6", iconColor)} /> : <Volume2 className={cn("w-6 h-6", iconColor)} />}
      </button>
    </motion.div>
  );
}
