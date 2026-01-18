"use client";

import * as React from "react";
import { FormattedMessage } from "react-intl";
import { cn } from "@/shared/lib/utils";

interface ConfirmPassButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  /**
   * Whether a player is selected (enables the button)
   */
  hasSelection: boolean;
  /**
   * Whether the pass action is in progress
   */
  isPending?: boolean;
}

/**
 * ConfirmPassButton - Button to confirm passing the packet
 *
 * Black button that confirms the pass action.
 * Disabled when no player is selected or action is in progress.
 */
export function ConfirmPassButton({
  hasSelection,
  isPending = false,
  disabled,
  className,
  ...props
}: ConfirmPassButtonProps) {
  const isDisabled = disabled || !hasSelection || isPending;

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={cn(
        "w-[203px] h-[60px] bg-black text-white",
        "font-space text-sm font-bold leading-5 tracking-[0.7px] uppercase",
        "transition-all",
        "hover:bg-gray-900",
        "disabled:bg-gray-400 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {isPending ? (
        <span className="animate-pulse">...</span>
      ) : (
        <FormattedMessage id="pass_game.confirm_pass" defaultMessage="Confirm Pass" />
      )}
    </button>
  );
}
