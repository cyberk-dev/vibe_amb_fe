"use client";

import type { ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { motion } from "framer-motion";
import { SoundButton } from "@/shared/ui/sound-button";
import { GameFormField } from "@/shared/ui/form-field";
import { useInviteCodeFlow, type FlowState } from "../lib/use-invite-code-flow";
import { LanguageToggleButton } from "@/shared/ui";

/**
 * Invite Code Screen - Whitelist Registration
 *
 * Flow:
 * 1. User connects wallet (Aptos Connect / Google)
 * 2. Auto-register in whitelist → code is auto-generated
 * 3. User enters display name
 * 4. Continue → save to store → navigate to /landing
 *
 * Design: Based on Figma design at node 3:52
 * - Background: custom-vivid-red (#ef4523)
 * - Decorative circles with floating animations
 * - Form with code display (readonly) and name input
 * - Fonts: Bricolage Grotesque (title), Space Grotesk (form)
 */

// ========================================
// Animation Variants
// ========================================

const circleVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      delay: i * 0.2,
    },
  }),
};

const floatAnimation = {
  y: [0, -20, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

const titleContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, x: -100 },
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

const bylineVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 1.2,
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const formContainerVariants = {
  hidden: {
    opacity: 0,
    y: 100,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
      delay: 0.8,
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      opacity: { delay: 1.4, duration: 0.3 },
      scale: { type: "spring" as const, stiffness: 300, damping: 20 },
    },
  },
};

/** Get button text based on flow state */
function getButtonTextId(flowState: FlowState, canContinue: boolean): string {
  switch (flowState) {
    case "not_connected":
      return "invite_code.form.connect_wallet";
    case "loading":
    case "registering":
      return "invite_code.form.registering";
    case "failed":
      return "invite_code.form.failed";
    case "ready":
      return canContinue ? "invite_code.form.continue" : "invite_code.form.enter_name";
    default:
      return "invite_code.form.continue";
  }
}

// ========================================
// Component
// ========================================

export function InviteCodeScreen() {
  const intl = useIntl();

  const { flowState, inviteCode, displayName, setDisplayName, handleConnect, handleContinue, canContinue } =
    useInviteCodeFlow();

  const codePlaceholder = intl.formatMessage({ id: "invite_code.form.code_placeholder" });
  const namePlaceholder = intl.formatMessage({ id: "invite_code.form.name_placeholder" });

  const isLoading = ["loading", "registering"].includes(flowState);
  const isCodeReady = flowState === "ready";

  // ========================================
  // Event Handlers
  // ========================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (flowState === "not_connected") {
      handleConnect();
      return;
    }

    if (flowState === "ready" && canContinue) {
      handleContinue();
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow alphanumeric and underscore
    const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 20);
    setDisplayName(value);
  };

  return (
    <div className="h-full bg-custom-vivid-red overflow-hidden relative">
      {/* Decorative circles with entrance animations */}
      <motion.div
        className="absolute w-[524.658px] h-[524.658px] rounded-full bg-custom-light-orange top-[354px] left-[639px] will-change-transform"
        variants={circleVariants}
        initial="initial"
        animate="animate"
        custom={0}
        whileInView={floatAnimation}
      />
      <motion.div
        className="absolute w-[431.213px] h-[431.213px] rounded-full bg-custom-very-dark-blue top-[360.37px] left-[965.68px] will-change-transform"
        variants={circleVariants}
        initial="initial"
        animate="animate"
        custom={1}
        whileInView={floatAnimation}
      />

      {/* Top right controls: Language toggle and Sound button */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
        <LanguageToggleButton />
        <SoundButton variant="dark" />
      </div>

      {/* Main content */}
      <div className="h-full flex flex-col justify-between p-6 md:p-12 relative z-10">
        {/* Hero title */}
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-[1027px]">
            <motion.div variants={titleContainerVariants} initial="hidden" animate="visible">
              <h1 className="font-bold leading-[0.9] text-white font-bricolage text-[160px] [font-variation-settings:'opsz'_14,'wdth'_100]">
                <motion.span className="block whitespace-nowrap" variants={wordVariants}>
                  <FormattedMessage
                    id="invite_code.hero.line1"
                    values={{
                      money: (chunks: ReactNode) => <span className="text-custom-light-orange">{chunks}</span>,
                    }}
                  />
                </motion.span>
                <motion.span className="block whitespace-nowrap" variants={wordVariants}>
                  <FormattedMessage
                    id="invite_code.hero.line2"
                    values={{
                      battle: (chunks: ReactNode) => <span className="text-custom-very-dark-blue">{chunks}</span>,
                    }}
                  />
                </motion.span>
              </h1>
              <motion.p
                className="text-white text-[20px] uppercase tracking-[1.2px] mt-6 font-space"
                variants={bylineVariants}
              >
                <FormattedMessage id="invite_code.hero.byline" />
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Bottom section with form */}
        <motion.div
          className="w-full max-w-[576px]"
          variants={formContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="border-2 border-[rgba(255,228,220,0.5)] p-8 md:p-9 bg-white/10 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Code Input - Readonly, auto-filled after registration */}
              <GameFormField>
                <GameFormField.Label variant="game">
                  <FormattedMessage id="invite_code.form.code_label" />
                </GameFormField.Label>
                <GameFormField.Input
                  variant="game-code"
                  type="text"
                  value={inviteCode}
                  readOnly
                  placeholder={isCodeReady ? "" : codePlaceholder}
                  disabled={!isCodeReady}
                  className={isCodeReady ? "bg-white/20" : ""}
                />
              </GameFormField>

              {/* Name Input */}
              <GameFormField>
                <GameFormField.Label variant="game">
                  <FormattedMessage id="invite_code.form.name_label" />
                </GameFormField.Label>
                <GameFormField.Input
                  variant="game-text"
                  type="text"
                  value={displayName}
                  onChange={handleNameChange}
                  placeholder={namePlaceholder}
                  disabled={!isCodeReady}
                  maxLength={20}
                />
              </GameFormField>

              {/* Helper text for name validation */}
              {isCodeReady && displayName.length > 0 && displayName.length < 2 && (
                <p className="text-white/60 text-sm font-space">
                  <FormattedMessage
                    id="invite_code.form.name_hint"
                    defaultMessage="Name must be at least 2 characters"
                  />
                </p>
              )}

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={isLoading || (flowState === "ready" && !canContinue)}
                className="group flex items-center gap-3 text-white text-xl font-medium hover:text-yellow-200 transition-colors pt-2 disabled:opacity-50 disabled:cursor-not-allowed font-space cursor-pointer"
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="uppercase tracking-wider">
                  <FormattedMessage id={getButtonTextId(flowState, canContinue)} />
                </span>
                {isLoading ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <motion.span
                    className="text-xl"
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    →
                  </motion.span>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
