"use client";

import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface InlineLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * InlineLoader - A compact animated loader for inline/partial loading states
 *
 * Use this for loading states within a page section (not full page).
 * For full page loading, use FullScreenLoader instead.
 */
export function InlineLoader({ className, size = "md" }: InlineLoaderProps) {
  const dotSize = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };

  const containerGap = {
    sm: "gap-1",
    md: "gap-1.5",
    lg: "gap-2",
  };

  return (
    <div className={cn("flex items-center justify-center py-8", containerGap[size], className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn("bg-custom-vivid-red rounded-full", dotSize[size])}
          animate={{
            y: [0, -8, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
