import { Bomb } from "lucide-react";
import { useRevealBombs } from "../api/use-reveal-bombs";
import { AdminActionButton } from "./admin-action-button";
import { GameStatus } from "@/entities/game";

interface RevealBombsButtonProps {
  currentStatus: GameStatus;
}

export function RevealBombsButton({ currentStatus }: RevealBombsButtonProps) {
  const { mutate, isPending } = useRevealBombs();

  const canReveal = currentStatus === GameStatus.REVEALING;

  return (
    <AdminActionButton
      onClick={() => mutate()}
      isPending={isPending}
      disabled={!canReveal}
      variant="danger"
      icon={<Bomb size={16} />}
    >
      Reveal Bombs
    </AdminActionButton>
  );
}
