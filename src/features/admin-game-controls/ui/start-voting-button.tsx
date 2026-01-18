import { PlayCircle } from "lucide-react";
import { useStartVoting } from "../api/use-start-voting";
import { AdminActionButton } from "./admin-action-button";
import { GameStatus } from "@/entities/game";

interface StartVotingButtonProps {
  currentStatus: GameStatus;
}

export function StartVotingButton({ currentStatus }: StartVotingButtonProps) {
  const { mutate, isPending } = useStartVoting();

  const canStart = currentStatus === GameStatus.REVEALED;

  return (
    <AdminActionButton
      onClick={() => mutate()}
      isPending={isPending}
      disabled={!canStart}
      variant="default"
      icon={<PlayCircle size={16} />}
    >
      Start Voting
    </AdminActionButton>
  );
}
