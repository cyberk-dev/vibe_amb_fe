"use client";

import { FormattedMessage } from "react-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";

interface ConfirmShareDialogProps {
  /**
   * Whether the dialog is open
   */
  open: boolean;
  /**
   * Callback when dialog should close
   */
  onOpenChange: (open: boolean) => void;
  /**
   * Callback when user confirms to share
   */
  onConfirm: () => void;
}

/**
 * Dialog shown when user tries to vote to share prize
 * Asks "Bạn sợ à?" with options to cancel or continue
 */
export function ConfirmShareDialog({ open, onOpenChange, onConfirm }: ConfirmShareDialogProps) {
  const handleShareClick = () => {
    // "Thôi, sợ lắm" → Chia tiền (confirm share)
    onConfirm();
  };

  const handleContinueClick = () => {
    // "Sợ gì, chơi tiếp" → Hủy, không vote share (close dialog)
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <FormattedMessage id="decision.confirm_share.message" defaultMessage="Bạn sợ à?" />
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleContinueClick}>
            <FormattedMessage id="decision.confirm_share.confirm" defaultMessage="Sợ gì, chơi tiếp" />
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleShareClick}>
            <FormattedMessage id="decision.confirm_share.cancel" defaultMessage="Thôi, sợ lắm" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
