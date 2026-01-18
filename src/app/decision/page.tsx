"use client";

import dynamic from "next/dynamic";
import { GameFlowGuard } from "@/widgets/game-flow-guard";
import { FullScreenLoader } from "@/shared/ui";

// Dynamic import with ssr: false to prevent Aptos SDK from being bundled in SSR
const DecisionScreen = dynamic(() => import("@/screens/decision").then((mod) => mod.DecisionScreen), {
  ssr: false,
  loading: () => <FullScreenLoader />,
});

export default function DecisionPage() {
  return (
    <GameFlowGuard>
      <DecisionScreen />
    </GameFlowGuard>
  );
}
