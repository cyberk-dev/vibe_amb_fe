import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AudioState {
  isMuted: boolean;
  volume: number;
  isPlaying: boolean;
}

interface AudioActions {
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  setPlaying: (playing: boolean) => void;
}

interface AudioStore {
  state: AudioState;
  actions: AudioActions;
}

/**
 * Global Audio Store
 *
 * Manages background music state across the entire app.
 * Persisted to localStorage to remember user's mute preference.
 */
export const useAudioStore = create<AudioStore>()(
  persist(
    (set) => ({
      state: {
        isMuted: false,
        volume: 0.3,
        isPlaying: false,
      },

      actions: {
        toggleMute: () => {
          set((store) => ({
            ...store,
            state: {
              ...store.state,
              isMuted: !store.state.isMuted,
            },
          }));
        },

        setMuted: (muted: boolean) => {
          set((store) => ({
            ...store,
            state: {
              ...store.state,
              isMuted: muted,
            },
          }));
        },

        setVolume: (volume: number) => {
          set((store) => ({
            ...store,
            state: {
              ...store.state,
              volume: Math.max(0, Math.min(1, volume)),
            },
          }));
        },

        setPlaying: (playing: boolean) => {
          set((store) => ({
            ...store,
            state: {
              ...store.state,
              isPlaying: playing,
            },
          }));
        },
      },
    }),
    {
      name: "audio-settings",
      partialize: (store) => ({
        state: {
          isMuted: store.state.isMuted,
          volume: store.state.volume,
          // Don't persist isPlaying - always start paused
          isPlaying: false,
        },
      }),
    },
  ),
);

/**
 * Hook to get audio state
 */
export const useAudioState = () => {
  return useAudioStore((store) => store.state);
};

/**
 * Hook to get audio actions
 */
export const useAudioActions = () => {
  return useAudioStore((store) => store.actions);
};

/**
 * Hook to get mute state and toggle function (convenience hook)
 */
export const useSoundToggle = () => {
  const isMuted = useAudioStore((store) => store.state.isMuted);
  const toggleMute = useAudioStore((store) => store.actions.toggleMute);
  return { isMuted, toggleMute };
};
