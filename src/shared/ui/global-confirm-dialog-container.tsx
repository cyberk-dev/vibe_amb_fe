"use client";

import { useGlobalDialogState, useGlobalDialogActions } from "@/shared/lib/stores";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";

export const GlobalConfirmDialogContainer = () => {
  const dialogState = useGlobalDialogState();
  const { confirmAction, cancelAction } = useGlobalDialogActions();

  return (
    <ConfirmDialog
      isOpen={dialogState.isOpen}
      isLoading={dialogState.isLoading}
      options={dialogState.options}
      onConfirm={confirmAction}
      onCancel={cancelAction}
    />
  );
};
