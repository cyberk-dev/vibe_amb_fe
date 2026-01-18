"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { FormattedMessage, useIntl } from "react-intl";
import { SoundButton } from "@/shared/ui/sound-button";

interface LandingScreenProps {
  playerName?: string;
  onJoinMatchmaking?: () => void;
  onViewDemo?: () => void;
  onViewWallet?: () => void;
}

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
 * - User arrives after successful authentication (wallet/Google)
 * - User can join matchmaking, view demo, or check wallet
 *
 * @see docs/prd.md for game rules and flow
 */
export function LandingScreen({ playerName, onJoinMatchmaking, onViewDemo, onViewWallet }: LandingScreenProps) {
  const intl = useIntl();
  const [isMuted, setIsMuted] = useState(false);
  const displayName = playerName?.trim() || intl.formatMessage({ id: "landing.defaults.player_name" });
  const illustrationAlt = intl.formatMessage({ id: "landing.illustration_alt" });

  return (
    <div className="h-full bg-[#fff7ed] p-2">
      {/* Border frame */}
      <div className="h-full border-8 border-[#f54900] relative overflow-hidden">
        {/* Main content - split layout */}
        <div className="h-full flex flex-col lg:flex-row">
          {/* Left side - Game lore and description */}
          <div className="w-full lg:w-[63%] h-full flex flex-col justify-between p-8 md:p-12 lg:p-16 overflow-hidden">
            {/* Top content */}
            <div className="flex-1 flex items-center min-h-0 overflow-hidden">
              <div className="w-full h-full flex flex-col gap-8">
                {/* Main title */}
                <div className="space-y-4 flex-shrink-0 font-bricolage">
                  <h1 className="font-bold text-[80px] md:text-[96px] lg:text-[128px] leading-[0.9] text-[#f54900]">
                    <FormattedMessage id="landing.hero.title" />
                  </h1>
                  <p className="text-custom-very-dark-blue text-base font-medium">
                    <FormattedMessage id="landing.hero.greeting" values={{ playerName: displayName }} />
                  </p>
                </div>

                {/* Game description */}
                <div className="space-y-6 flex-shrink-0 font-space">
                  <p className="font-normal text-[#364153] text-base leading-5 tracking-wider uppercase">
                    <FormattedMessage id="landing.description.first" />
                  </p>
                  <p className="font-normal text-[#364153] text-base leading-5 tracking-wider uppercase">
                    <FormattedMessage
                      id="landing.description.second"
                      values={{
                        highlight: (chunks: ReactNode) => (
                          <span className="font-bold text-custom-light-orange text-xl">{chunks}</span>
                        ),
                      }}
                    />
                  </p>
                </div>

                {/* Featured illustration - 40% of parent */}
                <div className="flex-1 min-h-0 w-auto max-w-3xl">
                  <div className="border-2 border-custom-light-orange rounded-[10px] overflow-hidden h-full w-fit relative">
                    <Image
                      src="/mai-dell-thanh-cong.webp"
                      alt={illustrationAlt}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="h-full w-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom footer */}
            <div className="mt-4 pt-2 flex-shrink-0 font-space">
              <p className="text-custom-dark-grayish-blue text-base tracking-[1.2px] uppercase">
                <FormattedMessage id="landing.footer" />
              </p>
            </div>
          </div>

          {/* Right side - Matchmaking controls */}
          <div className="w-full lg:w-[37%] relative flex items-center justify-center p-8 md:p-12 lg:p-16 min-h-[600px] lg:h-full bg-gradient-to-br from-[#E7000B] to-[#F54900]">
            {/* Decorative circle overlay */}
            <div className="absolute rounded-full bg-[rgba(255,137,4,0.2)] w-[300px] h-[300px] md:w-[350px] md:h-[350px] lg:w-[406px] lg:h-[406px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

            {/* Sound toggle button */}
            <SoundButton
              isMuted={isMuted}
              onToggle={() => setIsMuted(!isMuted)}
              iconColor="text-white"
              className="absolute top-4 right-4"
            />

            {/* Center content */}
            <div className="relative z-10 w-full max-w-[340px] space-y-12">
              {/* Player count display */}
              <div className="text-center space-y-4">
                <h2 className="font-bold text-[180px] md:text-[210px] lg:text-[240px] leading-none text-white/80 font-bricolage">
                  20
                </h2>
                <p className="text-white text-xl tracking-wider uppercase font-space">
                  <FormattedMessage id="landing.players_required" />
                </p>
              </div>

              {/* Action buttons */}
              <div className="space-y-4 font-space">
                <button
                  type="button"
                  onClick={onJoinMatchmaking}
                  className="w-full bg-custom-very-dark-blue text-white font-bold text-sm tracking-wider uppercase py-5 px-12 hover:bg-[#154450] transition-colors"
                >
                  <FormattedMessage id="landing.actions.join_matchmaking" />
                </button>
                <button
                  type="button"
                  onClick={onViewDemo}
                  className="w-full bg-custom-light-orange border-2 border-white/40 text-white font-bold text-sm tracking-wider uppercase py-5 px-12 hover:bg-[#ff7a28] transition-colors"
                >
                  <FormattedMessage id="landing.actions.view_demo" />
                </button>
                <button
                  type="button"
                  onClick={onViewWallet}
                  className="w-full bg-black text-white font-bold text-sm tracking-wider uppercase py-5 px-12 hover:bg-gray-900 transition-colors"
                >
                  <FormattedMessage id="landing.actions.view_wallet" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
