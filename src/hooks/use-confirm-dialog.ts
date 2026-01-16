import { useGlobalDialogActions, type ConfirmDialogOptions } from "@/shared/lib/stores";

export const useConfirmDialog = () => {
  const { showConfirm } = useGlobalDialogActions();

  return {
    showConfirm,
  };
};

export type { ConfirmDialogOptions };
