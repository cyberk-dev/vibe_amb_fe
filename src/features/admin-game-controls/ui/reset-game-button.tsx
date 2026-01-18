import { RotateCcw } from "lucide-react";
import { useResetGame } from "../api/use-reset-game";
import { AdminActionButton } from "./admin-action-button";
import { GameStatus } from "@/entities/game";

interface ResetGameButtonProps {
  currentStatus: GameStatus;
}

export function ResetGameButton({ currentStatus }: ResetGameButtonProps) {
  const { mutate, isPending } = useResetGame();

  const canReset = currentStatus === GameStatus.ENDED;

  return (
    <AdminActionButton
      onClick={() => mutate()}
      isPending={isPending}
      disabled={!canReset}
      variant="danger"
      icon={<RotateCcw size={16} />}
    >
      Reset Game
    </AdminActionButton>
  );
}
