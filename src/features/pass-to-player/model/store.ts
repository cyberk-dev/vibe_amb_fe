import { create } from "zustand";

/**
 * Store for managing pass selection state in the pass game
 */
interface PassSelectionStore {
  /** ID of the currently selected target player (null if none selected) */
  selectedPlayerId: string | null;
  /** Whether the pass has been confirmed (locked in) */
  isConfirmed: boolean;
  /** Whether a pass action is in progress */
  isPassing: boolean;

  /** Select a player as pass target */
  selectPlayer: (playerId: string) => void;
  /** Deselect current player */
  deselectPlayer: () => void;
  /** Toggle player selection */
  togglePlayer: (playerId: string) => void;
  /** Confirm the current selection */
  confirmSelection: () => void;
  /** Reset selection state (for new round) */
  resetSelection: () => void;
  /** Set passing state */
  setIsPassing: (isPassing: boolean) => void;
}

export const usePassSelectionStore = create<PassSelectionStore>((set, get) => ({
  selectedPlayerId: null,
  isConfirmed: false,
  isPassing: false,

  selectPlayer: (playerId) =>
    set({
      selectedPlayerId: playerId,
      isConfirmed: false,
    }),

  deselectPlayer: () =>
    set({
      selectedPlayerId: null,
      isConfirmed: false,
    }),

  togglePlayer: (playerId) => {
    const { selectedPlayerId, isConfirmed } = get();
    // Don't toggle if already confirmed
    if (isConfirmed) return;

    if (selectedPlayerId === playerId) {
      set({ selectedPlayerId: null });
    } else {
      set({ selectedPlayerId: playerId });
    }
  },

  confirmSelection: () => {
    const { selectedPlayerId } = get();
    if (selectedPlayerId) {
      set({ isConfirmed: true });
    }
  },

  resetSelection: () =>
    set({
      selectedPlayerId: null,
      isConfirmed: false,
      isPassing: false,
    }),

  setIsPassing: (isPassing) => set({ isPassing }),
}));
