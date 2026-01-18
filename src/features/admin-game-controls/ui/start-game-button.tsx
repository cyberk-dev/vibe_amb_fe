import { Play } from "lucide-react";
import { useStartGame } from "../api/use-start-game";
import { AdminActionButton } from "./admin-action-button";
import { GameStatus } from "@/entities/game";

interface StartGameButtonProps {
  currentStatus: GameStatus;
  playersCount: number;
}

export function StartGameButton({ currentStatus, playersCount }: StartGameButtonProps) {
  const { mutate, isPending } = useStartGame();

  const canStart = currentStatus === GameStatus.PENDING && playersCount >= 5;

  return (
    <AdminActionButton
      onClick={() => mutate()}
      isPending={isPending}
      disabled={!canStart}
      variant="success"
      icon={<Play size={16} />}
    >
      Start Game
    </AdminActionButton>
  );
}
