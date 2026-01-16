import { create } from "zustand";

export interface ConfirmDialogOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

interface DialogState {
  isOpen: boolean;
  isLoading: boolean;
  options: ConfirmDialogOptions;
  resolver?: (value: boolean) => void;
}

interface DialogActions {
  showConfirm: (options?: ConfirmDialogOptions) => Promise<boolean>;
  confirmAction: () => void;
  cancelAction: () => void;
  setLoading: (loading: boolean) => void;
}

interface GlobalDialogStore {
  state: DialogState;
  actions: DialogActions;
}

export const useGlobalDialogStore = create<GlobalDialogStore>((set, get) => ({
  state: {
    isOpen: false,
    isLoading: false,
    options: {},
  },

  actions: {
    showConfirm: (options: ConfirmDialogOptions = {}) => {
      return new Promise<boolean>((resolve) => {
        set((state) => ({
          ...state,
          state: {
            isOpen: true,
            isLoading: false,
            options,
            resolver: resolve,
          },
        }));
      });
    },

    confirmAction: () => {
      const { state } = get();
      const { resolver } = state;

      set((prevState) => ({
        ...prevState,
        state: {
          isOpen: false,
          isLoading: false,
          options: {},
        },
      }));

      resolver?.(true);
    },

    cancelAction: () => {
      const { state } = get();
      const { resolver } = state;

      set((prevState) => ({
        ...prevState,
        state: {
          isOpen: false,
          isLoading: false,
          options: {},
        },
      }));

      resolver?.(false);
    },

    setLoading: (loading: boolean) => {
      set((prevState) => ({
        ...prevState,
        state: {
          ...prevState.state,
          isLoading: loading,
        },
      }));
    },
  },
}));

export const useGlobalDialogState = () => {
  return useGlobalDialogStore((store) => store.state);
};

export const useGlobalDialogActions = () => {
  return useGlobalDialogStore((store) => store.actions);
};
