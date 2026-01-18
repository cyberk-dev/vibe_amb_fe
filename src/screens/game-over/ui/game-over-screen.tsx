"use client";

import { motion } from "framer-motion";
import { FormattedMessage } from "react-intl";
import { cn } from "@/shared/lib/utils";
import { SoundButton } from "@/shared/ui/sound-button";

// ========================================
// Animation Variants
// ========================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const labelVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, x: -80, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 70,
      damping: 15,
      delay: 0.1,
    },
  },
};

const winnerCardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
      delay: 0.2,
    },
  },
};

const standingsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.3,
    },
  },
};

const standingItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

interface PlayerStanding {
  rank: number;
  name: string;
  playerLabel: string;
  winnings: number;
  isOut?: boolean;
}

interface GameOverScreenProps {
  winner: {
    name: string;
    playerLabel: string;
    rank: number;
    winnings: number;
  };
  totalWinnings: number;
  standings: PlayerStanding[];
  onBackToHome?: () => void;
}

/**
 * Game Over Screen - Final Results Display
 *
 * Displays the final results when a game ends:
 * - Winner announcement with trophy
 * - Total winnings display
 * - Final standings of all players
 *
 * Design: Based on Figma design at node 59-1084
 * - Gradient background
 * - Orange border frame (#FF8C42)
 * - Fonts: Bricolage Grotesque (headlines), Space Grotesk (body)
 *
 * Mobile: Controls under title, scrollable standings list
 * Desktop: Controls on right side, 2-column standings
 */
export function GameOverScreen({ winner, totalWinnings, standings, onBackToHome }: GameOverScreenProps) {
  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#FFF7ED] via-white to-[#FEF2F2]">
      {/* Main border frame */}
      <motion.div
        className="min-h-screen border-4 md:border-8 border-[#FF8C42] flex flex-col px-4 py-6 md:p-[48px] lg:p-[64px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header section - Desktop layout */}
        <div className="hidden md:flex justify-between items-start">
          {/* Left side - Title */}
          <div className="flex flex-col gap-2">
            {/* "Final Results" label */}
            <motion.p
              className="font-space text-xs leading-[1.33] tracking-[3px] uppercase text-[#FF8C42]"
              variants={labelVariants}
            >
              <FormattedMessage id="game_over.final_results" defaultMessage="FINAL RESULTS" />
            </motion.p>
            {/* "Game Over" heading */}
            <motion.h1
              className="font-bricolage font-bold text-[100px] lg:text-[128px] leading-[0.85] text-black"
              variants={titleVariants}
            >
              <FormattedMessage id="game_over.title" defaultMessage="Game Over" />
            </motion.h1>
          </div>

          {/* Right side - Controls */}
          <motion.div className="flex items-center gap-4" variants={labelVariants}>
            {/* Complete button */}
            <button className="px-[26px] border-2 border-[#FF8C42] h-[48px] font-space text-sm font-medium text-[#FF8C42] flex items-center justify-center hover:bg-[#FF8C42]/5 transition-colors">
              <FormattedMessage id="game_over.complete" defaultMessage="Complete" />
            </button>
            {/* Sound toggle button */}
            <SoundButton variant="dark" />
          </motion.div>
        </div>

        {/* Header section - Mobile layout */}
        <div className="flex flex-col gap-3 md:hidden">
          {/* "Final Results" label */}
          <motion.p
            className="font-space text-[10px] leading-[1.33] tracking-[2px] uppercase text-[#FF8C42]"
            variants={labelVariants}
          >
            <FormattedMessage id="game_over.final_results" defaultMessage="FINAL RESULTS" />
          </motion.p>

          {/* "Game Over" heading */}
          <motion.h1
            className="font-bricolage font-bold text-[48px] leading-[0.85] text-black"
            variants={titleVariants}
          >
            <FormattedMessage id="game_over.title" defaultMessage="Game Over" />
          </motion.h1>

          {/* Controls row - under title on mobile */}
          <motion.div className="flex gap-2 items-center" variants={labelVariants}>
            {/* Complete button */}
            <button className="px-4 border-2 border-[#FF8C42] h-10 font-space text-xs font-medium text-[#FF8C42] flex items-center justify-center">
              <FormattedMessage id="game_over.complete" defaultMessage="Complete" />
            </button>
            {/* Sound toggle button */}
            <SoundButton variant="dark" />
          </motion.div>
        </div>

        {/* Winner section */}
        <motion.div
          className="mt-6 md:mt-8 p-4 md:p-8 bg-white border-2 md:border-4 border-[#FF8C42] w-full"
          variants={winnerCardVariants}
        >
          <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 md:gap-8">
            {/* Left - Winner info */}
            <div className="flex items-center gap-4">
              {/* Winner rank circle with trophy */}
              <div className="flex items-center gap-2">
                {/* Rank circle */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#FF8C42] flex items-center justify-center relative">
                  <span className="font-space font-bold text-[24px] md:text-[30px] leading-[1.2] text-white">1</span>
                  {/* Trophy emoji */}
                  <span className="absolute top-[-12px] right-[-8px] text-[28px] md:text-[36px] leading-[1.11]">
                    🏆
                  </span>
                </div>
              </div>

              {/* Winner name and label */}
              <div className="flex flex-col gap-1 md:gap-2">
                <p className="font-space text-[10px] md:text-xs leading-[1.33] tracking-[2.4px] uppercase text-[#FF8C42]">
                  <FormattedMessage id="game_over.winner" defaultMessage="WINNER" />
                </p>
                <h2 className="font-bricolage font-bold text-2xl md:text-[48px] leading-[1] text-black">
                  {winner.name}
                </h2>
                <p className="font-space text-xs md:text-sm leading-[1.43] tracking-[0.7px] uppercase text-black/60">
                  {winner.playerLabel}
                </p>
              </div>
            </div>

            {/* Right - Total winnings */}
            <div className="w-full md:w-auto px-4 md:px-[50px] pt-4 md:pt-[34px] pb-2 md:pb-[2px] border-2 border-[#FF8C42] bg-[rgba(255,140,66,0.05)] flex flex-col justify-center gap-1 md:gap-2">
              <p className="font-bricolage font-bold text-3xl md:text-[60px] leading-[1] text-center text-[#FF8C42]">
                {formatCurrency(totalWinnings)}
              </p>
              <p className="font-space text-[10px] md:text-xs leading-[1.33] tracking-[0.6px] uppercase text-center text-black/60">
                <FormattedMessage id="game_over.total_winnings" defaultMessage="Total Winnings" />
              </p>
            </div>
          </div>
        </motion.div>

        {/* Final Standings section */}
        <div className="mt-6 md:mt-10 flex flex-col gap-3 md:gap-6">
          {/* Section header */}
          <motion.p
            className="font-space text-[10px] md:text-xs leading-[1.33] tracking-[2px] md:tracking-[3px] uppercase text-black/40"
            variants={labelVariants}
          >
            <FormattedMessage id="game_over.final_standings" defaultMessage="FINAL STANDINGS" />
          </motion.p>

          {/* Standings list - 2 columns on desktop, 1 column on mobile */}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full" variants={standingsContainerVariants}>
            {standings.map((player) => {
              const isFirst = player.rank === 1;
              const isOut = player.isOut;

              // Determine border color based on player status
              const borderColor = isFirst ? "#000000" : isOut ? "rgba(220, 38, 38, 0.3)" : "#1B5E71";

              return (
                <motion.div
                  key={player.rank}
                  className="flex justify-between items-center gap-4 px-3 md:px-6 py-0 bg-white border-2"
                  style={{ borderColor }}
                  variants={standingItemVariants}
                >
                  {/* Left - Rank and player info */}
                  <div className="flex items-center gap-2 md:gap-4 py-3">
                    {/* Rank badge */}
                    <div
                      className={cn(
                        "w-8 h-8 md:w-12 md:h-12 flex items-center justify-center shrink-0",
                        isFirst ? "bg-[#FF8C42]" : "bg-black",
                      )}
                    >
                      <span className="font-space font-bold text-xs md:text-lg leading-[1.56] text-white">
                        {isFirst ? "1ST" : `#${player.rank}`}
                      </span>
                    </div>

                    {/* Player name and label */}
                    <div className="flex flex-col gap-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-space font-bold text-sm md:text-lg leading-[1.56] text-black">
                          {player.name}
                        </h3>
                        {player.isOut && (
                          <span className="px-1 py-0.5 md:px-[9px] md:py-[5px] text-[8px] md:text-[10px] leading-[1.5] tracking-[0.5px] uppercase text-[#DC2626] border border-[#DC2626]">
                            <FormattedMessage id="game_over.out" defaultMessage="OUT" />
                          </span>
                        )}
                      </div>
                      <p className="font-space text-[10px] md:text-xs leading-[1.33] tracking-[0.6px] uppercase text-black/50">
                        {player.playerLabel}
                      </p>
                    </div>
                  </div>

                  {/* Right - Winnings */}
                  <div className="px-2 md:px-[26px] pt-2 md:pt-[14px] pb-1 md:pb-[2px] border-2 border-black flex items-center shrink-0">
                    <p className="font-space font-bold text-sm md:text-xl leading-[1.4] text-black">
                      {formatCurrency(player.winnings)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Footer - Play Again button */}
        <motion.div className="mt-6 md:mt-10 flex-shrink-0" variants={labelVariants}>
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="w-full h-[50px] md:h-[60px] bg-black text-white font-space font-bold text-xs md:text-sm leading-[1.43] tracking-[2.8px] uppercase hover:bg-black/90 transition-colors"
            >
              <FormattedMessage id="game_over.play_again" defaultMessage="PLAY AGAIN" />
            </button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
