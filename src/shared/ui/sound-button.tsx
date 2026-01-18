"use client";

import { Volume2, VolumeX } from "lucide-react";
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
   * Icon color class (tailwind text-* class)
   * @default "text-custom-vivid-red"
   */
  iconColor?: string;
  /**
   * Additional classes for container
   */
  className?: string;
}

/**
 * Sound Toggle Button
 *
 * A reusable button component for toggling sound on/off.
 * Displays VolumeX icon when muted, Volume2 icon when unmuted.
 *
 * Can be used in two modes:
 * 1. Controlled: Pass isMuted and onToggle props
 * 2. Global: Uses the global audio store (default)
 *
 * @example
 * ```tsx
 * // Using global store (recommended)
 * <SoundButton />
 *
 * // Controlled mode
 * const [isMuted, setIsMuted] = useState(false);
 * <SoundButton isMuted={isMuted} onToggle={() => setIsMuted(!isMuted)} />
 * ```
 */
export function SoundButton({
  isMuted: controlledMuted,
  onToggle: controlledToggle,
  iconColor = "text-custom-vivid-red",
  className,
}: SoundButtonProps) {
  const { isMuted: globalMuted, toggleMute: globalToggle } = useSoundToggle();

  // Use controlled props if provided, otherwise use global store
  const isMuted = controlledMuted ?? globalMuted;
  const onToggle = controlledToggle ?? globalToggle;

  return (
    <div className={cn("bg-white/50 rounded-lg p-1", className)}>
      <button
        type="button"
        className="w-8 h-8 flex items-center justify-center"
        aria-label="Toggle sound"
        onClick={onToggle}
      >
        {isMuted ? (
          <VolumeX className={cn("w-full h-full", iconColor)} />
        ) : (
          <Volume2 className={cn("w-full h-full", iconColor)} />
        )}
      </button>
    </div>
  );
}
