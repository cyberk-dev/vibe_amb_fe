"use client";

import { motion } from "framer-motion";
import { FormattedMessage } from "react-intl";
import { cn } from "@/shared/lib/utils";

interface ConfirmPassButtonProps {
  /**
   * Whether a player is selected (enables the button)
   */
  hasSelection: boolean;
  /**
   * Whether the pass action is in progress
   */
  isPending?: boolean;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  /**
   * Additional classes
   */
  className?: string;
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
  onClick,
  disabled,
  className,
}: ConfirmPassButtonProps) {
  const isDisabled = disabled || !hasSelection || isPending;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        "w-[203px] h-[60px] bg-black text-white cursor-pointer",
        "font-space text-sm font-bold leading-5 tracking-[0.7px] uppercase",
        "transition-all",
        "hover:bg-gray-900",
        "disabled:bg-gray-400 disabled:cursor-not-allowed",
        className,
      )}
      whileHover={!isDisabled ? { scale: 1.03 } : undefined}
      whileTap={!isDisabled ? { scale: 0.97 } : undefined}
    >
      {isPending ? (
        <span className="animate-pulse">...</span>
      ) : (
        <FormattedMessage id="pass_game.confirm_pass" defaultMessage="Confirm Pass" />
      )}
    </motion.button>
  );
}
