"use client";

import { FormattedMessage } from "react-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
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
      <AlertDialogContent className="border-2 border-black">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black">
            <FormattedMessage
              id="pass_game.errors.player_already_selected"
              defaultMessage="Tiếc quá, người này bị pick trước rồi, hãy chọn lại"
            />
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => onOpenChange(false)}
            className="bg-custom-light-orange text-white hover:bg-custom-light-orange/90 border-2 border-black"
          >
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
