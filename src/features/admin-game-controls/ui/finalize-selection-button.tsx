import { CheckCircle } from "lucide-react";
import { useFinalizeSelection } from "../api/use-finalize-selection";
import { AdminActionButton } from "./admin-action-button";
import { GameStatus } from "@/entities/game";

interface FinalizeSelectionButtonProps {
  currentStatus: GameStatus;
}

export function FinalizeSelectionButton({ currentStatus }: FinalizeSelectionButtonProps) {
  const { mutate, isPending } = useFinalizeSelection();

  const canFinalize = currentStatus === GameStatus.SELECTION;

  return (
    <AdminActionButton
      onClick={() => mutate()}
      isPending={isPending}
      disabled={!canFinalize}
      variant="default"
      icon={<CheckCircle size={16} />}
    >
      Finalize Selection
    </AdminActionButton>
  );
}
