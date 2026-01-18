"use client";

import dynamic from "next/dynamic";
import { GameFlowGuard } from "@/widgets/game-flow-guard";

// Dynamic import with ssr: false to prevent Aptos SDK from being bundled in SSR
const DecisionScreen = dynamic(() => import("@/screens/decision").then((mod) => mod.DecisionScreen), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center">
      <div className="text-gray-400">Loading Decision Screen...</div>
    </div>
  ),
});

export default function DecisionPage() {
  return (
    <GameFlowGuard>
      <DecisionScreen />
    </GameFlowGuard>
  );
}
