import { RevealScreen } from "@/screens/reveal";
import { GameFlowGuard } from "@/widgets/game-flow-guard";

export default function RevealPage() {
  return (
    <GameFlowGuard>
      <RevealScreen />
    </GameFlowGuard>
  );
}
