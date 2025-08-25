import {
  useGlobalDialogActions,
  ConfirmDialogOptions,
} from "@/stores/global-dialog-store";

export const useConfirmDialog = () => {
  const { showConfirm } = useGlobalDialogActions();

  return {
    showConfirm,
  };
};

export type { ConfirmDialogOptions };
