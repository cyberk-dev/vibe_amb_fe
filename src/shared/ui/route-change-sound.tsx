"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSoundEffects } from "@/shared/lib";

/**
 * RouteChangeSound - Plays a sound effect when navigating between screens
 *
 * Add this component once in your root layout to enable screen transition sounds.
 */
export function RouteChangeSound() {
  const pathname = usePathname();
  const prevPathnameRef = useRef<string | null>(null);
  const { playScreenTransition } = useSoundEffects();

  useEffect(() => {
    // Only play sound if this is a route change (not initial load)
    if (prevPathnameRef.current !== null && prevPathnameRef.current !== pathname) {
      playScreenTransition();
    }
    prevPathnameRef.current = pathname;
  }, [pathname, playScreenTransition]);

  return null;
}
