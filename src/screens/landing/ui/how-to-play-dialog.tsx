"use client";

import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/ui/dialog";

interface HowToPlayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * HowToPlayDialog - Displays game instructions
 *
 * Shows the game rules and how to play instructions.
 */
export function HowToPlayDialog({ open, onOpenChange }: HowToPlayDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[600px] max-h-[calc(90vh-4rem)] overflow-y-auto my-auto"
        showCloseButton={true}
      >
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bricolage font-bold text-custom-very-dark-blue">
            <FormattedMessage id="landing.how_to_play.title" />
          </DialogTitle>
        </DialogHeader>

        <DialogDescription asChild>
          <div className="space-y-4 font-space text-base leading-6 text-custom-very-dark-blue">
            <p className="font-normal">
              <FormattedMessage id="landing.how_to_play.content.intro" />
            </p>

            <p className="font-normal">
              <FormattedMessage id="landing.how_to_play.content.rounds" />
            </p>

            <p className="font-medium">
              <FormattedMessage id="landing.how_to_play.content.phase1" />
            </p>

            <p className="font-medium">
              <FormattedMessage id="landing.how_to_play.content.phase2" />
            </p>

            <p className="font-medium">
              <FormattedMessage id="landing.how_to_play.content.phase3" />
            </p>

            <p className="font-bold text-custom-light-orange">
              <FormattedMessage id="landing.how_to_play.content.continue" />
            </p>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
