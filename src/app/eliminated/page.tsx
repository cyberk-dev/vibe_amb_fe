"use client";

import dynamic from "next/dynamic";
import { GameFlowGuard } from "@/widgets/game-flow-guard";
import { FullScreenLoader } from "@/shared/ui";

const EliminatedScreen = dynamic(() => import("@/screens/eliminated").then((mod) => mod.EliminatedScreen), {
  ssr: false,
  loading: () => <FullScreenLoader />,
});

export default function EliminatedPage() {
  return (
    <GameFlowGuard>
      <EliminatedScreen />
    </GameFlowGuard>
  );
}
