"use client";

import { useState, useRef, Children, type ReactNode } from "react";
import Image from "next/image";
import { FormattedMessage, useIntl } from "react-intl";
import { motion } from "framer-motion";
import { SoundButton } from "@/shared/ui/sound-button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLandingFlow } from "../lib/use-landing-flow";
import { HowToPlayDialog } from "./how-to-play-dialog";

// ========================================
// Animation Variants
// ========================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, x: -80, scale: 0.9 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
    },
  },
};

const greetingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      delay: 0.3,
    },
  },
};

const descriptionVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
      delay: 0.5 + i * 0.15,
    },
  }),
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 60,
      damping: 15,
      delay: 0.8,
    },
  },
};

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 1.2,
      duration: 0.5,
    },
  },
};

const rightPanelVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 60,
      damping: 18,
      delay: 0.3,
    },
  },
};

const circleVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
      delay: 0.5,
    },
  },
};

const playerCountVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
      delay: 0.7,
    },
  },
};

const playerLabelVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.9,
      duration: 0.4,
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      opacity: { delay: 1 + i * 0.12, duration: 0.3 },
      y: { delay: 1 + i * 0.12, type: "spring" as const, stiffness: 120, damping: 15 },
      scale: { type: "spring" as const, stiffness: 300, damping: 20 },
    },
  }),
};

const pulseAnimation = {
  scale: [1, 1.02, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

/** Number of players required to start a game */
const REQUIRED_PLAYERS = 20;

/**
 * Landing Screen - Game Introduction
 *
 * Welcome screen that introduces the Lucky Money Battle Royale game lore
 * and provides access to matchmaking, demo, and wallet.
 *
 * Design: Based on Figma design at node 4:80
 * - Split layout: left (game lore) + right (matchmaking controls)
 * - Orange border frame (#f54900)
 * - Fonts: Bricolage Grotesque (headlines), Space Grotesk (body)
 *
 * Flow:
 * - User arrives from /invite-code with registration data in store
 * - User clicks "Join Matchmaking" → join_game(code, displayName) → /pass
 *
 * @see docs/prd.md for game rules and flow
 */
export function LandingScreen() {
  const intl = useIntl();
  const { playerName, isJoining, handleJoinMatchmaking } = useLandingFlow();
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);

  const handleScrollToMatchmaking = () => {
    rightPanelRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToLeft = () => {
    leftPanelRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const displayName = playerName?.trim() || intl.formatMessage({ id: "landing.defaults.player_name" });
  const illustrationAlt = intl.formatMessage({ id: "landing.illustration_alt" });

  const handleViewDemo = () => {
    setIsHowToPlayOpen(true);
  };

  return (
    <div className="h-screen bg-[#fff7ed]">
      {/* Border frame */}
      <div className="h-full border-8 border-[#f54900] relative overflow-y-auto lg:overflow-hidden">
        {/* Main content - split layout */}
        <div className="h-full flex flex-col lg:flex-row">
          {/* Left side - Game lore and description */}
          <motion.div
            ref={leftPanelRef}
            className="w-full lg:w-[63%] min-h-screen lg:h-full flex flex-col justify-between p-4 md:p-8 lg:p-12 lg:p-16 lg:overflow-hidden relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Top content */}
            <div className="flex-1 flex items-center min-h-0 overflow-hidden">
              <div className="w-full h-full flex flex-col gap-8">
                {/* Main title */}
                <div className="space-y-4 flex-shrink-0 font-bricolage">
                  <motion.h1
                    className="font-bold text-[64px] md:text-[96px] lg:text-[128px] leading-[0.9] text-[#f54900]"
                    variants={titleVariants}
                  >
                    <FormattedMessage id="landing.hero.title" />
                  </motion.h1>
                  <motion.p className="text-custom-very-dark-blue text-base font-medium" variants={greetingVariants}>
                    <FormattedMessage
                      id="landing.hero.greeting"
                      values={{
                        playerName: displayName,
                        strikethrough: (chunks: ReactNode) => (
                          <del className="line-through">{Children.toArray(chunks)}</del>
                        ),
                      }}
                    >
                      {(chunks) => <>{Children.toArray(chunks)}</>}
                    </FormattedMessage>
                  </motion.p>
                </div>

                {/* Game description */}
                <div className="space-y-6 flex-shrink-0 font-space">
                  <motion.p
                    className="font-normal text-[#364153] text-base leading-5 tracking-wider uppercase"
                    variants={descriptionVariants}
                    custom={0}
                  >
                    <FormattedMessage id="landing.description.first" />
                  </motion.p>
                  <motion.p
                    className="font-normal text-[#364153] text-base leading-5 tracking-wider uppercase"
                    variants={descriptionVariants}
                    custom={1}
                  >
                    <FormattedMessage
                      id="landing.description.second"
                      values={{
                        highlight: (chunks: ReactNode) => (
                          <span className="font-bold text-custom-light-orange text-xl">{Children.toArray(chunks)}</span>
                        ),
                      }}
                    >
                      {(chunks) => <>{Children.toArray(chunks)}</>}
                    </FormattedMessage>
                  </motion.p>
                </div>

                {/* Featured illustration - 40% of parent */}
                <motion.div className="flex-1 min-h-0 w-auto max-w-3xl" variants={imageVariants}>
                  <motion.div className="border-2 border-custom-light-orange rounded-[10px] overflow-hidden h-full w-fit relative">
                    <Image
                      src="/mai-dell-thanh-cong.webp"
                      alt={illustrationAlt}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="h-full w-auto object-contain"
                    />
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Bottom footer with mobile scroll indicator */}
            <motion.div
              className="mt-4 pt-2 flex-shrink-0 font-space flex flex-col items-center lg:items-start gap-4"
              variants={footerVariants}
            >
              <p className="text-custom-light-grayish-blue text-base tracking-[1.2px] uppercase text-center lg:text-left">
                <FormattedMessage id="landing.footer" />
              </p>

              {/* Mobile scroll indicator - only visible on mobile */}
              <motion.button
                type="button"
                className="lg:hidden cursor-pointer"
                onClick={handleScrollToMatchmaking}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                aria-label="Scroll to matchmaking"
              >
                <ChevronDown size={32} className="text-[#f54900]" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right side - Matchmaking controls */}
          <motion.div
            ref={rightPanelRef}
            className="w-full lg:w-[37%] relative flex items-start pt-16 lg:pt-0 lg:items-center justify-center p-8 md:p-12 lg:p-16 min-h-screen lg:h-full bg-gradient-to-br from-[#E7000B] to-[#F54900]"
            variants={rightPanelVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Mobile scroll-up indicator */}
            <motion.button
              type="button"
              className="absolute top-4 left-1/2 -translate-x-1/2 lg:hidden cursor-pointer z-20"
              onClick={handleScrollToLeft}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              aria-label="Scroll to top"
            >
              <ChevronUp size={32} className="text-white/80" />
            </motion.button>
            {/* Decorative circle overlay */}
            <motion.div
              className="absolute rounded-full bg-[rgba(255,137,4,0.2)] w-[300px] h-[300px] md:w-[350px] md:h-[350px] lg:w-[406px] lg:h-[406px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              variants={circleVariants}
              animate={pulseAnimation}
            />

            {/* Sound toggle button */}
            <SoundButton variant="light" className="absolute top-4 right-4" />

            {/* Center content */}
            <div className="relative z-10 w-full max-w-[340px] space-y-12">
              {/* Player count display */}
              <div className="text-center space-y-4">
                <h2 className="font-bold text-[180px] md:text-[210px] lg:text-[240px] leading-none text-white/80 font-bricolage">
                  {REQUIRED_PLAYERS}
                </h2>
                <motion.p className="text-white text-xl tracking-wider uppercase font-space">
                  <FormattedMessage id="landing.players_required" />
                </motion.p>
              </div>

              {/* Action buttons */}
              <div className="space-y-4 font-space">
                <motion.button
                  type="button"
                  onClick={handleJoinMatchmaking}
                  disabled={isJoining}
                  className="w-full bg-custom-very-dark-blue text-white font-bold text-sm tracking-wider uppercase py-5 px-12 hover:bg-[#154450] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  custom={0}
                >
                  {isJoining ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <FormattedMessage id="landing.actions.joining" defaultMessage="Joining..." />
                    </>
                  ) : (
                    <FormattedMessage id="landing.actions.join_matchmaking" />
                  )}
                </motion.button>
                <motion.button
                  type="button"
                  disabled={isJoining}
                  className="w-full bg-custom-light-orange border-2 border-white/40 text-white font-bold text-sm tracking-wider uppercase py-5 px-12 hover:bg-[#ff7a28] transition-colors cursor-pointer disabled:opacity-50"
                  onClick={handleViewDemo}
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  custom={1}
                >
                  <FormattedMessage id="landing.actions.view_demo" />
                </motion.button>
                <motion.button
                  type="button"
                  disabled={isJoining}
                  className="w-full bg-black text-white font-bold text-sm tracking-wider uppercase py-5 px-12 hover:bg-gray-900 transition-colors cursor-pointer disabled:opacity-50"
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  custom={2}
                >
                  <FormattedMessage id="landing.actions.view_wallet" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* How to Play Dialog */}
      <HowToPlayDialog open={isHowToPlayOpen} onOpenChange={setIsHowToPlayOpen} />
    </div>
  );
}
