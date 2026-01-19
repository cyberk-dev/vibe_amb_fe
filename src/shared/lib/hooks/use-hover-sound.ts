"use client";

import { useCallback } from "react";
import { useSoundEffects } from "@/shared/lib";

/**
 * Hook to add hover sound effect to any element
 *
 * Returns event handlers to spread onto the element
 *
 * @example
 * const { onMouseEnter } = useHoverSound();
 * <button onMouseEnter={onMouseEnter}>Click me</button>
 */
export function useHoverSound() {
  const { playButtonHover } = useSoundEffects();

  const onMouseEnter = useCallback(() => {
    playButtonHover();
  }, [playButtonHover]);

  return { onMouseEnter };
}
