"use client";

import { useState, useCallback } from "react";
import { DecisionWidget } from "@/widgets/decision";
import { ConfirmShareDialog } from "@/widgets/decision/ui/confirm-share-dialog";
import { useDecisionFlow } from "../lib/use-decision-flow";
import { Loader2 } from "lucide-react";

export function DecisionScreen() {
  const [showConfirmShareDialog, setShowConfirmShareDialog] = useState(false);

  const {
    remainingPlayers,
    eliminatedPlayer,
    prizePerPlayer,
    totalPool,
    nextRoundPool,
    voteCounts,
    currentUserVote,
    onSharePrize,
    onContinuePlaying,
    isVoting,
    isLoading,
  } = useDecisionFlow();

  const handleSharePrizeClick = useCallback(() => {
    setShowConfirmShareDialog(true);
  }, []);

  const handleConfirmShare = useCallback(async () => {
    await onSharePrize();
    setShowConfirmShareDialog(false);
  }, [onSharePrize]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Fallback if no eliminated player
  const defaultEliminatedPlayer = {
    id: "0",
    name: "No one",
    seatNumber: 0,
    consolationPrize: 0,
  };

  return (
    <>
      <DecisionWidget
        totalPlayers={remainingPlayers.length}
        eliminatedPlayer={eliminatedPlayer ?? defaultEliminatedPlayer}
        remainingPlayers={remainingPlayers}
        prizePerPlayer={prizePerPlayer}
        totalPool={totalPool}
        nextRoundPool={nextRoundPool}
        voteCounts={voteCounts}
        onSharePrize={handleSharePrizeClick}
        onContinuePlaying={onContinuePlaying}
        isVoting={isVoting}
        currentUserVote={currentUserVote}
      />

      <ConfirmShareDialog
        open={showConfirmShareDialog}
        onOpenChange={setShowConfirmShareDialog}
        onConfirm={handleConfirmShare}
      />
    </>
  );
}
