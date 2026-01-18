"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface AnimatedDigitsProps {
  /**
   * The number to display
   */
  value: number;
  /**
   * Minimum number of digits to display (pads with leading zeros)
   */
  minDigits?: number;
  /**
   * Additional classes for the container
   */
  className?: string;
  /**
   * Classes for each digit
   */
  digitClassName?: string;
}

/**
 * AnimatedDigits - Slot machine style animated number display
 *
 * Each digit animates independently - only digits that change
 * will animate up while others stay in place.
 * Uses overflow hidden to create the slot machine effect.
 */
export function AnimatedDigits({ value, minDigits = 2, className, digitClassName }: AnimatedDigitsProps) {
  // Convert number to array of digit strings, pad with leading zeros
  const digits = String(value).padStart(minDigits, "0").split("");

  return (
    <span className={cn("inline-flex", className)}>
      {digits.map((digit, index) => (
        <span key={index} className="relative overflow-hidden inline-block" style={{ height: "1em", lineHeight: 1 }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={`${index}-${digit}`}
              className={cn("inline-block", digitClassName)}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              {digit}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}
