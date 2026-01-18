"use client";

import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface SoundButtonProps {
  /**
   * Whether sound is muted
   */
  isMuted: boolean;
  /**
   * Callback when sound button is clicked
   */
  onToggle: () => void;
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
 * @example
 * ```tsx
 * const [isMuted, setIsMuted] = useState(false);
 * <SoundButton isMuted={isMuted} onToggle={() => setIsMuted(!isMuted)} />
 * ```
 */
export function SoundButton({ isMuted, onToggle, iconColor = "text-custom-vivid-red", className }: SoundButtonProps) {
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
