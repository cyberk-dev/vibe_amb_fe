import { Vote } from "lucide-react";
import { useFinalizeVoting } from "../api/use-finalize-voting";
import { AdminActionButton } from "./admin-action-button";
import { GameStatus } from "@/entities/game";

interface FinalizeVotingButtonProps {
  currentStatus: GameStatus;
}

export function FinalizeVotingButton({ currentStatus }: FinalizeVotingButtonProps) {
  const { mutate, isPending } = useFinalizeVoting();

  const canFinalize = currentStatus === GameStatus.VOTING;

  return (
    <AdminActionButton
      onClick={() => mutate()}
      isPending={isPending}
      disabled={!canFinalize}
      variant="default"
      icon={<Vote size={16} />}
    >
      Finalize Voting
    </AdminActionButton>
  );
}
