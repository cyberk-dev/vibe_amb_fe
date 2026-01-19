"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAudioState, useAudioActions } from "@/shared/lib/stores";

// Path to background music in public folder or assets
const BG_MUSIC_SRC = "/sounds/bg-music.mp3";

/**
 * BackgroundMusic - Global background music player
 *
 * Features:
 * - Plays looping background music
 * - Respects global mute state from audio store
 * - Handles autoplay restrictions (requires user interaction)
 * - Persists across page navigations
 *
 * Usage: Add this component once in your root layout
 */
export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInteracted = useRef(false);
  const { isMuted, volume, isPlaying } = useAudioState();
  const { setPlaying } = useAudioActions();

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(BG_MUSIC_SRC);
      audio.loop = true;
      audio.volume = volume;
      audioRef.current = audio;

      // Handle audio ending (shouldn't happen with loop, but just in case)
      audio.addEventListener("ended", () => {
        setPlaying(false);
      });

      // Handle errors
      audio.addEventListener("error", (e) => {
        console.error("Background music error:", e);
        setPlaying(false);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [setPlaying, volume]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle mute/unmute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Try to play when user interacts with the page
  const tryPlay = useCallback(async () => {
    if (!audioRef.current || hasInteracted.current) return;

    try {
      await audioRef.current.play();
      hasInteracted.current = true;
      setPlaying(true);
    } catch {
      // Autoplay was prevented, will try again on next interaction
      console.log("Autoplay prevented, waiting for user interaction");
    }
  }, [setPlaying]);

  // Listen for user interaction to start music
  useEffect(() => {
    const handleInteraction = () => {
      tryPlay();
    };

    // Try to play immediately (might work if autoplay is allowed)
    tryPlay();

    // Also listen for user interactions
    document.addEventListener("click", handleInteraction, { once: true });
    document.addEventListener("keydown", handleInteraction, { once: true });
    document.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, [tryPlay]);

  // Sync isPlaying state with actual audio state
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying && audioRef.current.paused) {
      audioRef.current.play().catch(() => {
        setPlaying(false);
      });
    }
  }, [isPlaying, setPlaying]);

  // This component doesn't render anything visible
  return null;
}
