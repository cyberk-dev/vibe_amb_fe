"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/shared/ui/page-header";
import { gameQueries, formatAptAmount } from "@/entities/game";
import { vaultQueries } from "@/entities/vault";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export function EliminatedScreen() {
  const { account } = useWallet();
  const address = account?.address?.toString();

  const { data: gameState } = useQuery({
    ...gameQueries.status(),
    refetchInterval: 3_000,
  });

  const { data: prizes } = useQuery(gameQueries.prizes());

  const { data: claimable = BigInt(0) } = useQuery({
    ...vaultQueries.claimable(address ?? ""),
    enabled: !!address,
  });

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-custom-cream to-custom-light-cream">
      <PageHeader />

      <motion.main
        className="flex flex-1 flex-col items-center justify-center px-4 pb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Eliminated Icon */}
        <motion.div
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100"
          variants={itemVariants}
        >
          <span className="text-5xl">💥</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="mb-2 font-bricolage text-3xl font-bold text-custom-dark-brown md:text-4xl"
          variants={itemVariants}
        >
          You&apos;ve Been Eliminated
        </motion.h1>

        {/* Subtitle */}
        <motion.p className="mb-8 text-center text-lg text-custom-dark-grayish-blue" variants={itemVariants}>
          Better luck next time! Wait for the game to end to see final results.
        </motion.p>

        {/* Info Card */}
        <motion.div
          className="w-full max-w-md rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm"
          variants={itemVariants}
        >
          <div className="space-y-4">
            {/* Consolation Prize */}
            <div className="flex items-center justify-between">
              <span className="text-custom-dark-grayish-blue">Consolation Prize</span>
              <span className="font-semibold text-custom-dark-brown">
                {claimable > 0 ? formatAptAmount(claimable) : formatAptAmount(prizes?.consolationPrize ?? BigInt(0))}
              </span>
            </div>

            {/* Current Round */}
            <div className="flex items-center justify-between">
              <span className="text-custom-dark-grayish-blue">Current Round</span>
              <span className="font-semibold text-custom-dark-brown">{gameState?.round ?? "-"}</span>
            </div>

            {/* Players Remaining */}
            <div className="flex items-center justify-between">
              <span className="text-custom-dark-grayish-blue">Players Remaining</span>
              <span className="font-semibold text-custom-dark-brown">{gameState?.playersCount ?? "-"}</span>
            </div>
          </div>
        </motion.div>

        {/* Waiting Indicator */}
        <motion.div className="mt-8 flex items-center gap-2 text-custom-dark-grayish-blue" variants={itemVariants}>
          <motion.div
            className="h-2 w-2 rounded-full bg-custom-orange"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span>Waiting for game to end...</span>
        </motion.div>
      </motion.main>
    </div>
  );
}
