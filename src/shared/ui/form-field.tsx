"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";

/**
 * GameFormField - Reusable form field component following FSD and React best practices
 *
 * Features:
 * - Compound component pattern for flexibility
 * - Proper accessibility with label-input association
 * - Memoized for performance
 * - Customizable through variants and className props
 * - Follows design system from Figma specs
 *
 * Usage:
 * ```tsx
 * <GameFormField>
 *   <GameFormField.Label>Label Text</GameFormField.Label>
 *   <GameFormField.Input placeholder="..." />
 * </GameFormField>
 * ```
 */

// Root component - provides context for disabled state
interface GameFormFieldRootProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
}

const GameFormFieldRoot = React.memo(
  React.forwardRef<HTMLDivElement, GameFormFieldRootProps>(({ className, disabled, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)} data-disabled={disabled} {...props}>
        {children}
      </div>
    );
  }),
);
GameFormFieldRoot.displayName = "GameFormField";

// Label component with theme variants
interface GameFormFieldLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {
  variant?: "default" | "game";
}

const GameFormFieldLabel = React.memo(
  React.forwardRef<React.ElementRef<typeof Label>, GameFormFieldLabelProps>(
    ({ className, variant = "default", ...props }, ref) => {
      return (
        <Label
          ref={ref}
          className={cn(
            {
              // Default variant - clean and minimal
              default: "text-sm font-medium text-foreground",
              // Game variant - matches invite code screen design
              game: "block text-white/70 text-base uppercase tracking-[1.2px] font-normal",
            }[variant],
            className,
          )}
          style={
            variant === "game"
              ? { fontFamily: "var(--font-space-grotesk)", ...((props as any).style || {}) }
              : (props as any).style
          }
          {...props}
        />
      );
    },
  ),
);
GameFormFieldLabel.displayName = "GameFormField.Label";

// Input component with theme variants
interface GameFormFieldInputProps extends React.ComponentPropsWithoutRef<typeof Input> {
  variant?: "default" | "game-code" | "game-text";
}

const GameFormFieldInput = React.memo(
  React.forwardRef<HTMLInputElement, GameFormFieldInputProps>(({ className, variant = "default", ...props }, ref) => {
    return (
      <Input
        ref={ref}
        className={cn(
          {
            // Default variant - uses shared Input styles
            default: "",
            // Game code variant - large, left-aligned for OTP code
            "game-code":
              "w-full px-4 py-4 bg-white/15 border-2 border-white/40 rounded-none text-white md:!text-[24px] font-bold tracking-[4.32px] text-left focus:outline-none focus:border-white focus:ring-0 focus-visible:ring-0 focus-visible:border-white focus:bg-white/20 transition-all placeholder:text-white/30",
            // Game text variant - standard text input with game theme
            "game-text":
              "w-full px-4 py-3 bg-white/15 border-2 border-white/40 rounded-none text-white md:!text-[18px] focus:outline-none focus:border-white focus:ring-0 focus-visible:ring-0 focus-visible:border-white focus:bg-white/20 transition-all placeholder:text-white/40",
          }[variant],
          className,
        )}
        style={
          variant === "game-code" || variant === "game-text"
            ? { fontFamily: "var(--font-space-grotesk)", ...((props as any).style || {}) }
            : (props as any).style
        }
        {...props}
      />
    );
  }),
);
GameFormFieldInput.displayName = "GameFormField.Input";

// Compound component export
const GameFormField = Object.assign(GameFormFieldRoot, {
  Label: GameFormFieldLabel,
  Input: GameFormFieldInput,
});

export { GameFormField };
export type { GameFormFieldRootProps, GameFormFieldLabelProps, GameFormFieldInputProps };
