"use client";

import { FormattedMessage } from "react-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";

interface PlayerAlreadySelectedDialogProps {
  /**
   * Whether the dialog is open
   */
  open: boolean;
  /**
   * Callback when dialog should close
   */
  onOpenChange: (open: boolean) => void;
}

/**
 * Dialog shown when user tries to pass bao to a player who has already been selected
 */
export function PlayerAlreadySelectedDialog({ open, onOpenChange }: PlayerAlreadySelectedDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Oops!</AlertDialogTitle>
          <AlertDialogDescription>
            <FormattedMessage
              id="pass_game.errors.player_already_selected"
              defaultMessage="Tiếc quá, người này bị pick trước rồi, hãy chọn lại"
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => onOpenChange(false)}>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
