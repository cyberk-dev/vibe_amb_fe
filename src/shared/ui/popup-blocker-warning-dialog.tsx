"use client";

import { useState, useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { AlertTriangle, Chrome, Globe } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./dialog";
import { Button } from "./button";

const POPUP_WARNING_STORAGE_KEY = "popup-warning-acknowledged";

interface PopupBlockerWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProceed: () => void;
}

/**
 * Dialog component that warns users about popup requirements before
 * initiating Google OAuth wallet connection.
 *
 * Shows browser-specific instructions for enabling pop-ups and
 * includes an option to not show the warning again.
 */
export function PopupBlockerWarningDialog({ open, onOpenChange, onProceed }: PopupBlockerWarningDialogProps) {
  const intl = useIntl();
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleProceed = useCallback(() => {
    if (dontShowAgain) {
      localStorage.setItem(POPUP_WARNING_STORAGE_KEY, "true");
    }
    onOpenChange(false);
    onProceed();
  }, [dontShowAgain, onOpenChange, onProceed]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <DialogTitle className="text-xl">
              <FormattedMessage id="popup_warning.title" />
            </DialogTitle>
          </div>
          <DialogDescription className="text-base">
            <FormattedMessage id="popup_warning.description" />
          </DialogDescription>
        </DialogHeader>

        {/* Browser instructions */}
        <div className="mt-4 space-y-3">
          <p className="font-medium text-sm text-foreground">
            <FormattedMessage id="popup_warning.instructions.title" />
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Chrome className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                <FormattedMessage id="popup_warning.instructions.chrome" />
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Globe className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                <FormattedMessage id="popup_warning.instructions.safari" />
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Globe className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                <FormattedMessage id="popup_warning.instructions.general" />
              </span>
            </li>
          </ul>
        </div>

        {/* Don't show again checkbox */}
        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="dont-show-again"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
          />
          <label htmlFor="dont-show-again" className="text-sm text-muted-foreground cursor-pointer select-none">
            <FormattedMessage id="popup_warning.dont_show_again" />
          </label>
        </div>

        <DialogFooter className="mt-6">
          <Button type="button" onClick={handleProceed} className="w-full sm:w-auto">
            <FormattedMessage id="popup_warning.proceed" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Hook to check if popup warning should be shown
 */
export function usePopupWarningAcknowledged(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(POPUP_WARNING_STORAGE_KEY) === "true";
}

/**
 * Utility to reset the popup warning acknowledgment (for testing)
 */
export function resetPopupWarningAcknowledgment(): void {
  localStorage.removeItem(POPUP_WARNING_STORAGE_KEY);
}
