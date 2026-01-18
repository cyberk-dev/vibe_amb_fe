"use client";

import { motion } from "framer-motion";

/**
 * FullScreenLoader - An attractive, animated full-screen loading component
 *
 * Features:
 * - Full screen with gradient background matching app theme
 * - Centered animated loader with pulsing effect
 * - Red packet themed animation
 * - Floating particles for visual interest
 */
export function FullScreenLoader() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(134.72deg, rgba(255, 247, 237, 1) 0%, rgba(255, 255, 255, 1) 50%, rgba(254, 242, 242, 1) 100%)",
      }}
    >
      {/* Animated border frame */}
      <motion.div
        className="absolute inset-4 md:inset-8 border-4 md:border-8 border-custom-vivid-red/20"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-custom-vivid-red/20 rounded-full"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Center content */}
      <div className="flex flex-col items-center gap-8">
        {/* Main loader animation */}
        <div className="relative">
          {/* Outer pulsing ring */}
          <motion.div
            className="absolute inset-0 border-4 border-custom-vivid-red/30 rounded-full"
            style={{ width: 120, height: 120, margin: -20 }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Middle ring */}
          <motion.div
            className="absolute inset-0 border-2 border-custom-light-orange/40 rounded-full"
            style={{ width: 100, height: 100, margin: -10 }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.1, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          />

          {/* Red packet icon container */}
          <motion.div
            className="w-20 h-20 bg-custom-vivid-red flex items-center justify-center relative overflow-hidden"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 1,
              }}
            />

            {/* Red packet emoji */}
            <motion.span
              className="text-4xl relative z-10"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              🧧
            </motion.span>
          </motion.div>

          {/* Rotating dots */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-custom-vivid-red rounded-full"
              style={{
                left: "50%",
                top: "50%",
                marginLeft: -4,
                marginTop: -4,
              }}
              animate={{
                x: [0, Math.cos((i * Math.PI) / 2) * 50],
                y: [0, Math.sin((i * Math.PI) / 2) * 50],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        {/* Loading text */}
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {/* Animated dots */}
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-custom-vivid-red rounded-full"
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
        </motion.div>
      </div>

      {/* Bottom decorative element */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="font-space text-xs uppercase tracking-[3px] text-black/20">VIBE Ambassador</p>
      </motion.div>
    </div>
  );
}
