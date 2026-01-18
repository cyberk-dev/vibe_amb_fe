"use client";

import { ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
 */
export function GameOverScreen({ winner, totalWinnings, standings, onBackToHome }: GameOverScreenProps) {
  const isMobile = useIsMobile();
  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-[#FFF7ED] via-white to-[#FEF2F2] overflow-auto">
      {/* Main border frame - covers entire page */}
      <div className="relative border-8 border-[#FF8C42] rounded-none min-h-full w-full">
        {/* Main content container with padding */}
        <div className={`relative z-10 flex flex-col min-h-full ${isMobile ? "px-4 py-6" : "p-[64px]"}`}>
          {/* Header section */}
          <div className={`flex justify-between items-start ${isMobile ? "" : "gap-[507px]"}`}>
            {/* Left side - Title */}
            <div className={`flex flex-col gap-4 ${isMobile ? "flex-1" : "w-[544px]"}`}>
              {/* "Final Results" label */}
              <p
                className={`font-space ${isMobile ? "text-[10px]" : "text-xs"} leading-[1.33] tracking-[3px] uppercase text-[#FF8C42]`}
              >
                FINAL RESULTS
              </p>
              {/* "Game Over" heading */}
              <h1
                className={`font-bricolage font-bold ${isMobile ? "text-4xl" : "text-[192px]"} leading-[0.85] text-black`}
              >
                <span>Game</span>
                <br />
                <span>Over</span>
              </h1>
            </div>

            {/* Right side - Complete button and back arrow */}
            <div
              className={`flex ${isMobile ? "flex-col items-end gap-2" : "items-center gap-4"} ${isMobile ? "" : "h-[48px]"} mt-0`}
            >
              {/* Complete button */}
              <button
                className={`${isMobile ? "w-full" : "px-[26px]"} border-2 border-[#FF8C42] h-[48px] font-space text-sm font-medium text-[#FF8C42] flex items-center justify-center ${isMobile ? "px-4" : ""}`}
              >
                Complete
              </button>
              {/* Back arrow button */}
              {onBackToHome && (
                <button
                  onClick={onBackToHome}
                  className="w-12 h-12 flex items-center justify-center text-[#FF8C42] hover:opacity-80 transition-opacity"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          {/* Winner section */}
          <div
            className={`mt-8 ${isMobile ? "px-4 pt-4 pb-2" : "px-[52px] pt-[52px] pb-[4px]"} bg-white border-4 border-[#FF8C42] w-full min-h-[256px]`}
          >
            <div
              className={`flex ${isMobile ? "flex-col" : "justify-between"} items-center ${isMobile ? "gap-4" : "gap-[649px]"}`}
            >
              {/* Left - Winner info */}
              <div className="flex items-center gap-4">
                {/* Winner rank circle with trophy */}
                <div className="flex items-center gap-2">
                  {/* Rank circle */}
                  <div className="w-20 h-20 rounded-full bg-[#FF8C42] flex items-center justify-center relative">
                    <span className="font-space font-bold text-[30px] leading-[1.2] text-white">1</span>
                    {/* Trophy emoji */}
                    <span className="absolute top-[-12px] right-[-8px] text-[36px] leading-[1.11]">🏆</span>
                  </div>
                </div>

                {/* Winner name and label */}
                <div className="flex flex-col gap-2">
                  <p
                    className={`font-space ${isMobile ? "text-[10px]" : "text-xs"} leading-[1.33] tracking-[2.4px] uppercase text-[#FF8C42]`}
                  >
                    WINNER
                  </p>
                  <h2
                    className={`font-bricolage font-bold ${isMobile ? "text-xl" : "text-[48px]"} leading-[1] text-black`}
                  >
                    {winner.name}
                  </h2>
                  <p
                    className={`font-space ${isMobile ? "text-xs" : "text-sm"} leading-[1.43] tracking-[0.7px] uppercase text-black/60`}
                  >
                    {winner.playerLabel}
                  </p>
                </div>
              </div>

              {/* Right - Total winnings */}
              <div
                className={`${isMobile ? "px-4 pt-4 pb-2" : "px-[50px] pt-[34px] pb-[2px]"} border-2 border-[#FF8C42] bg-[rgba(255,140,66,0.05)] ${isMobile ? "min-h-[100px]" : "min-h-[152px]"} flex flex-col justify-center gap-2`}
              >
                <p
                  className={`font-bricolage font-bold ${isMobile ? "text-2xl" : "text-[60px]"} leading-[1] text-center text-[#FF8C42]`}
                >
                  {formatCurrency(totalWinnings)}
                </p>
                <p
                  className={`font-space ${isMobile ? "text-[10px]" : "text-xs"} leading-[1.33] tracking-[0.6px] uppercase text-center text-black/60`}
                >
                  Total Winnings
                </p>
              </div>
            </div>
          </div>

          {/* Final Standings section */}
          <div className={`${isMobile ? "mt-6" : "mt-10"} flex flex-col ${isMobile ? "gap-4" : "gap-6"} w-full`}>
            {/* Section header */}
            <p
              className={`font-space ${isMobile ? "text-[10px]" : "text-xs"} leading-[1.33] tracking-[3px] uppercase text-black/40`}
            >
              FINAL STANDINGS
            </p>

            {/* Standings list - 2 columns on desktop, 1 column on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
              {standings.map((player) => {
                const isFirst = player.rank === 1;
                const isOut = player.isOut;

                // Determine border color based on player status
                const borderColor = isFirst ? "#000000" : isOut ? "rgba(220, 38, 38, 0.3)" : "#1B5E71";

                // Each item has its own border (all 4 sides)
                return (
                  <div
                    key={player.rank}
                    className={`flex justify-between items-center gap-4 ${isMobile ? "" : "md:gap-[334px]"} ${isMobile ? "px-3" : "px-6"} py-0 bg-white border-2`}
                    style={{ borderColor }}
                  >
                    {/* Left - Rank and player info */}
                    <div className={`flex items-center ${isMobile ? "gap-2" : "gap-4"} py-3`}>
                      {/* Rank badge */}
                      <div
                        className={`${isMobile ? "w-8 h-8" : "w-12 h-12"} flex items-center justify-center ${
                          isFirst ? "bg-[#FF8C42]" : "bg-black"
                        }`}
                      >
                        <span
                          className={`font-space font-bold ${isMobile ? "text-xs" : "text-lg"} leading-[1.56] ${
                            isFirst ? "text-white" : "text-white"
                          }`}
                        >
                          {isFirst ? "1ST" : `#${player.rank}`}
                        </span>
                      </div>

                      {/* Player name and label */}
                      <div className="flex flex-col gap-0">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`font-space font-bold ${isMobile ? "text-sm" : "text-lg"} leading-[1.56] text-black`}
                          >
                            {player.name}
                          </h3>
                          {player.isOut && (
                            <span
                              className={`${isMobile ? "px-1 py-0.5 text-[8px]" : "px-[9px] py-[5px] text-[10px]"} leading-[1.5] tracking-[0.5px] uppercase text-[#DC2626] border border-[#DC2626]`}
                            >
                              OUT
                            </span>
                          )}
                        </div>
                        <p
                          className={`font-space ${isMobile ? "text-[10px]" : "text-xs"} leading-[1.33] tracking-[0.6px] uppercase text-black/50`}
                        >
                          {player.playerLabel}
                        </p>
                      </div>
                    </div>

                    {/* Right - Winnings */}
                    <div
                      className={`${isMobile ? "px-2 pt-2 pb-1" : "px-[26px] pt-[14px] pb-[2px]"} border-2 border-black ${isMobile ? "min-h-[40px]" : "min-h-[56px]"} flex items-center shrink-0`}
                    >
                      <p
                        className={`font-space font-bold ${isMobile ? "text-sm" : "text-xl"} leading-[1.4] text-black`}
                      >
                        {formatCurrency(player.winnings)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div
            className={`${isMobile ? "mt-6 pt-4" : "mt-10 pt-[34px]"} border-t-2 border-black/10 flex ${isMobile ? "flex-col" : "justify-between"} items-center ${isMobile ? "gap-4" : ""}`}
          >
            {/* Copyright */}
            <p
              className={`font-space ${isMobile ? "text-[10px]" : "text-xs"} leading-[1.33] tracking-[2.4px] uppercase text-black/40 ${isMobile ? "text-center" : ""}`}
            >
              A GAME BY VIBE AMBASSADOR · 2026
            </p>

            {/* Back to home button */}
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className={`${isMobile ? "w-full" : "w-[200px]"} ${isMobile ? "h-[48px]" : "h-[60px]"} bg-black text-white font-space font-bold ${isMobile ? "text-xs" : "text-sm"} leading-[1.43] tracking-[2.8px] uppercase hover:bg-black/90 transition-colors`}
              >
                Back to home
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
