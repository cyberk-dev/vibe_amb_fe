"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FormattedMessage } from "react-intl";
import { cn } from "@/shared/lib/utils";
import type { RevealPackData, PackRevealState } from "../model/types";

export interface RevealPackCardProps extends React.ComponentPropsWithoutRef<"div"> {
  /**
   * Pack data containing player info and reveal state
   */
  pack: RevealPackData;
  /**
   * Size variant
   * - "sm": Compact size for grid display (mobile)
   * - "md": Medium size
   * - "lg": Large size for featured display
   */
  size?: "sm" | "md" | "lg";
  /**
   * Whether to show player header
   * @default true
   */
  showHeader?: boolean;
}

// Size configurations - using w-full for flexible widths
const sizeConfig = {
  sm: {
    wrapper: "w-full min-w-[106px]",
    header: "h-[41px] px-2 py-2",
    headerBadge: "size-6 text-[10px]",
    headerName: "text-[10px]",
    packContainer: "h-[136px]",
    packContent: "p-[6px]",
    packInner: "h-[124px]",
    pendingText: "text-[10px]",
    explodedEmoji: "text-[30px]",
    explodedBoom: "text-[14px]",
    explodedPrize: "text-[8px]",
    particleSize: 4,
  },
  md: {
    wrapper: "w-full min-w-[140px]",
    header: "h-[52px] px-3 py-2",
    headerBadge: "size-8 text-[13px]",
    headerName: "text-[13px]",
    packContainer: "h-[236px]",
    packContent: "p-2",
    packInner: "h-[220px]",
    pendingText: "text-[13px]",
    explodedEmoji: "text-[50px]",
    explodedBoom: "text-[18px]",
    explodedPrize: "text-[10px]",
    particleSize: 6,
  },
  lg: {
    wrapper: "w-full min-w-[220px]",
    header: "h-[64px] px-4 py-3",
    headerBadge: "size-10 text-base",
    headerName: "text-base",
    packContainer: "h-[244px]",
    packContent: "p-3",
    packInner: "h-[220px]",
    pendingText: "text-lg",
    explodedEmoji: "text-[70px]",
    explodedBoom: "text-[24px]",
    explodedPrize: "text-sm",
    particleSize: 8,
  },
};

// Default placeholder image for revealed packs
const DEFAULT_PACK_IMAGE = "/images/red-packet-placeholder.png";

/**
 * RevealPackCard - Displays a player's pack during the reveal phase
 */
export const RevealPackCard = React.forwardRef<HTMLDivElement, RevealPackCardProps>(
  ({ pack, size = "sm", showHeader = true, className, ...props }, ref) => {
    const { player, revealState, packNumber, consolationPrize, trolledBy, imageUrl } = pack;
    const config = sizeConfig[size];

    const isExploded = revealState === "revealed-exploded";
    const isPending = revealState === "pending";
    const isRevealedSafe = revealState === "revealed-safe";

    return (
      <motion.div
        ref={ref}
        className={cn("flex flex-col gap-2", config.wrapper, className)}
        {...props}
        animate={isExploded ? { x: [0, -3, 3, -2, 2, 0] } : {}}
        transition={isExploded ? { duration: 0.5, times: [0, 0.1, 0.3, 0.5, 0.7, 1] } : {}}
      >
        {/* Player header */}
        {showHeader && (
          <motion.div
            animate={isExploded ? { scale: [1, 1.02, 1] } : {}}
            transition={isExploded ? { duration: 0.3 } : {}}
          >
            <PlayerHeader player={player} revealState={revealState} config={config} />
          </motion.div>
        )}

        {/* Pack content with flip animation */}
        <div className="relative" style={{ perspective: "1000px" }}>
          <AnimatePresence mode="wait">
            {isPending ? (
              <motion.div
                key="pending"
                initial={{ rotateY: 0 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeIn" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <PackContainer config={config} state="pending">
                  <PendingState config={config} />
                </PackContainer>
              </motion.div>
            ) : (
              <motion.div
                key="revealed"
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <PackContainer config={config} state={isExploded ? "exploded" : "safe"}>
                  {isRevealedSafe && <RevealedSafeState imageUrl={imageUrl} packNumber={packNumber} config={config} />}
                  {isExploded && (
                    <ExplodedState consolationPrize={consolationPrize} trolledBy={trolledBy} config={config} />
                  )}
                </PackContainer>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  },
);

RevealPackCard.displayName = "RevealPackCard";

// ============================================================================
// Sub-components
// ============================================================================

interface PlayerHeaderProps {
  player: RevealPackData["player"];
  revealState: PackRevealState;
  config: (typeof sizeConfig)["sm"];
}

function PlayerHeader({ player, revealState, config }: PlayerHeaderProps) {
  const isExploded = revealState === "revealed-exploded";
  const isPending = revealState === "pending";

  return (
    <div
      className={cn(
        "flex items-center gap-[6px] border transition-colors duration-300",
        config.header,
        isExploded
          ? "bg-destructive border-destructive"
          : isPending
            ? "bg-white border-black/20"
            : "bg-white border-custom-very-dark-blue",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center shrink-0 transition-colors duration-300",
          config.headerBadge,
          isExploded ? "bg-white text-destructive" : "bg-black text-white",
        )}
      >
        <span className="font-space font-bold">{player.seatNumber}</span>
      </div>
      <span
        className={cn(
          "font-space font-bold truncate transition-colors duration-300",
          config.headerName,
          isExploded ? "text-white" : "text-black",
        )}
      >
        {player.name}
      </span>
    </div>
  );
}

interface PackContainerProps {
  config: (typeof sizeConfig)["sm"];
  state: "pending" | "safe" | "exploded";
  children: React.ReactNode;
}

function PackContainer({ config, state, children }: PackContainerProps) {
  return (
    <div
      className={cn(
        "w-full border overflow-hidden",
        config.packContainer,
        state === "exploded"
          ? "bg-white border-destructive border-2"
          : state === "pending"
            ? "bg-white/50 border-black/20"
            : "bg-white border-custom-very-dark-blue border-2",
      )}
    >
      <div className={cn("h-full", config.packContent)}>{children}</div>
    </div>
  );
}

interface PendingStateProps {
  config: (typeof sizeConfig)["sm"];
}

function PendingState({ config }: PendingStateProps) {
  return (
    <div className="size-full flex items-center justify-center bg-black/5">
      <motion.span
        className={cn("font-space font-normal text-black/30 uppercase", config.pendingText)}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        ?
      </motion.span>
    </div>
  );
}

interface RevealedSafeStateProps {
  imageUrl?: string;
  packNumber?: number;
  config: (typeof sizeConfig)["sm"];
}

function RevealedSafeState({ imageUrl, packNumber, config }: RevealedSafeStateProps) {
  const imgSrc = imageUrl || DEFAULT_PACK_IMAGE;

  return (
    <motion.div
      className={cn("relative size-full overflow-hidden", config.packInner)}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Golden glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-yellow-300/40 via-transparent to-orange-300/40"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image src={imgSrc} alt="Lucky Pack" fill className="object-cover opacity-80" unoptimized />
        <div className="absolute inset-0 bg-custom-light-orange/20" />
      </div>

      {/* Pack number overlay with pop animation */}
      {packNumber !== undefined && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
        >
          <motion.span
            className="font-bricolage font-light text-white text-[80px] leading-none tracking-[0.225px] uppercase drop-shadow-lg"
            animate={{
              textShadow: [
                "0 0 20px rgba(255,255,255,0.5)",
                "0 0 40px rgba(255,255,255,0.8)",
                "0 0 20px rgba(255,255,255,0.5)",
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {packNumber}
          </motion.span>
        </motion.div>
      )}

      {/* Sparkle particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-300 rounded-full"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
            y: [-10, -30],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeOut",
          }}
        />
      ))}
    </motion.div>
  );
}

interface ExplodedStateProps {
  consolationPrize?: string;
  trolledBy?: string;
  config: (typeof sizeConfig)["sm"];
}

// Explosion particles component
function ExplosionParticles({ size }: { size: number }) {
  const particles = React.useMemo(() => {
    return [...Array(12)].map((_, i) => ({
      id: i,
      angle: i * 30 * (Math.PI / 180),
      distance: 40 + Math.random() * 30,
      delay: Math.random() * 0.2,
      duration: 0.6 + Math.random() * 0.4,
    }));
  }, []);

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: size,
            height: size,
            left: "50%",
            top: "50%",
            background: p.id % 3 === 0 ? "#ff6b35" : p.id % 3 === 1 ? "#ffd700" : "#ff4444",
            boxShadow: `0 0 ${size}px ${p.id % 3 === 0 ? "#ff6b35" : p.id % 3 === 1 ? "#ffd700" : "#ff4444"}`,
          }}
          initial={{ x: "-50%", y: "-50%", scale: 0, opacity: 1 }}
          animate={{
            x: `calc(-50% + ${Math.cos(p.angle) * p.distance}px)`,
            y: `calc(-50% + ${Math.sin(p.angle) * p.distance}px)`,
            scale: [0, 1.5, 0],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}

// Fire ring effect
function FireRing() {
  return (
    <motion.div
      className="absolute inset-0 rounded-full border-4 border-orange-500"
      style={{ left: "10%", right: "10%", top: "10%", bottom: "10%" }}
      initial={{ scale: 0.5, opacity: 1 }}
      animate={{ scale: 2, opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
  );
}

function ExplodedState({ consolationPrize, trolledBy, config }: ExplodedStateProps) {
  return (
    <motion.div
      className="size-full bg-destructive flex flex-col items-center justify-center gap-1 overflow-hidden relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
    >
      {/* Initial flash effect */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* Fire ring effect */}
      <FireRing />

      {/* Explosion particles */}
      <ExplosionParticles size={config.particleSize} />

      {/* Animated radial gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, rgba(255,100,0,0.4) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 0.3, 0.6],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Multiple pulsing rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-4 border-2 border-white/30 rounded-full"
          animate={{
            scale: [1, 1.5],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Explosion emoji with dramatic entrance */}
      <motion.span
        className={cn("leading-none relative z-10", config.explodedEmoji)}
        initial={{ scale: 0, rotate: -180 }}
        animate={{
          scale: [0, 1.8, 1],
          rotate: [0, 15, -15, 0],
        }}
        transition={{
          scale: { duration: 0.5, times: [0, 0.4, 1], ease: "easeOut" },
          rotate: { duration: 0.6, times: [0, 0.3, 0.6, 1], delay: 0.3 },
        }}
      >
        💥
      </motion.span>

      {/* BOOM text with shake and glow */}
      <motion.span
        className={cn("font-space font-black text-white uppercase relative z-10 tracking-wider", config.explodedBoom)}
        initial={{ scale: 0, y: 20 }}
        animate={{
          scale: 1,
          y: 0,
          textShadow: [
            "0 0 10px #fff, 0 0 20px #ff0, 0 0 30px #ff0",
            "0 0 20px #fff, 0 0 40px #f80, 0 0 60px #f80",
            "0 0 10px #fff, 0 0 20px #ff0, 0 0 30px #ff0",
          ],
        }}
        transition={{
          scale: { type: "spring", stiffness: 400, damping: 15, delay: 0.2 },
          textShadow: { duration: 0.8, repeat: Infinity },
        }}
      >
        <FormattedMessage id="reveal_game.boom" defaultMessage="BOOM!" />
      </motion.span>

      {/* Consolation prize with slide up */}
      {consolationPrize && (
        <motion.span
          className={cn("font-space font-bold text-white/90 relative z-10", config.explodedPrize)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          {consolationPrize}
        </motion.span>
      )}

      {/* Trolled by message */}
      {trolledBy && (
        <motion.span
          className={cn("font-space font-normal text-white/80 text-center relative z-10", config.explodedPrize)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
        >
          <FormattedMessage
            id="reveal_game.trolled_by"
            defaultMessage="Trolled by {name}"
            values={{ name: trolledBy }}
          />
        </motion.span>
      )}

      {/* Floating embers */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`ember-${i}`}
          className="absolute w-1 h-1 bg-orange-400 rounded-full"
          style={{
            left: `${10 + Math.random() * 80}%`,
            bottom: "20%",
          }}
          animate={{
            y: [0, -60 - Math.random() * 40],
            x: [0, (Math.random() - 0.5) * 30],
            opacity: [1, 0],
            scale: [1, 0.5],
          }}
          transition={{
            duration: 1.5 + Math.random(),
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeOut",
          }}
        />
      ))}
    </motion.div>
  );
}
