"use client";

import { useCallback, useRef } from "react";
import { useAudioState } from "../stores";

// Sound effect paths
export const SoundEffects = {
  SAFE_REVEAL: "/sounds/game-bonus-02-294436.mp3",
  SCREEN_TRANSITION: "/sounds/game-bonus-144751.mp3",
  EXPLODED_REVEAL: "/sounds/game-character-140506.mp3",
  BUTTON_HOVER: "/sounds/pop-sound-423716.mp3",
} as const;

export type SoundEffect = (typeof SoundEffects)[keyof typeof SoundEffects];

// Default volumes for sound effects (independent from background music volume)
const SFX_VOLUMES = {
  SAFE_REVEAL: 0.8,
  EXPLODED_REVEAL: 0.9,
  SCREEN_TRANSITION: 0.7,
  BUTTON_HOVER: 0.5,
} as const;

/**
 * Hook for playing sound effects
 *
 * Respects the global mute state from audio store.
 * Each sound effect is played independently and doesn't interrupt others.
 */
export function useSoundEffects() {
  const { isMuted } = useAudioState();
  const audioCache = useRef<Map<string, HTMLAudioElement>>(new Map());

  const playSound = useCallback(
    (sound: SoundEffect, options?: { volume?: number }) => {
      if (isMuted) return;

      // Get or create audio element
      let audio = audioCache.current.get(sound);
      if (!audio) {
        audio = new Audio(sound);
        audioCache.current.set(sound, audio);
      }

      // Reset and play
      audio.currentTime = 0;
      audio.volume = options?.volume ?? 0.8;
      audio.play().catch(() => {
        // Ignore autoplay errors
      });
    },
    [isMuted],
  );

  const playSafeReveal = useCallback(() => {
    playSound(SoundEffects.SAFE_REVEAL, { volume: SFX_VOLUMES.SAFE_REVEAL });
  }, [playSound]);

  const playExplodedReveal = useCallback(() => {
    playSound(SoundEffects.EXPLODED_REVEAL, { volume: SFX_VOLUMES.EXPLODED_REVEAL });
  }, [playSound]);

  const playScreenTransition = useCallback(() => {
    playSound(SoundEffects.SCREEN_TRANSITION, { volume: SFX_VOLUMES.SCREEN_TRANSITION });
  }, [playSound]);

  const playButtonHover = useCallback(() => {
    playSound(SoundEffects.BUTTON_HOVER, { volume: SFX_VOLUMES.BUTTON_HOVER });
  }, [playSound]);

  return {
    playSound,
    playSafeReveal,
    playExplodedReveal,
    playScreenTransition,
    playButtonHover,
  };
}

/**
 * Standalone function to play sound (for use outside of React components)
 * Note: This doesn't respect mute state - use the hook for that
 */
export function playSoundStandalone(sound: SoundEffect, volume = 0.8) {
  const audio = new Audio(sound);
  audio.volume = volume;
  audio.play().catch(() => {
    // Ignore autoplay errors
  });
}
