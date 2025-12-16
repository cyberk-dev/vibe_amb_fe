"use client";

import { useState } from "react";
import { useCreateToken, useIsAdmin } from "@/integrations/smartcontracts/token-factory";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { CreateTokenForm } from "../_components/create-token-form";

export const CreateTokenFormContainer = () => {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenSupply, setTokenSupply] = useState("");

  const { address, isConnected } = useAccount();
  const { data: isAdmin } = useIsAdmin(address);

  const { handleCreateToken, isConfirming, isConfirmed, isWritingPending, hash } = useCreateToken({
    onSuccess: (receipt) => {
      toast.success("Token created successfully!", {
        description: `Transaction hash: ${receipt.transactionHash}`,
      });
      setTokenName("");
      setTokenSymbol("");
      setTokenSupply("");
    },
    onError: (error) => {
      toast.error("Failed to create token", {
        description: error.shortMessage || error.details || "Unknown error occurred",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tokenName || !tokenSymbol || !tokenSupply) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isAdmin) {
      toast.error("You don't have admin role to create tokens");
      return;
    }

    await handleCreateToken(tokenName, tokenSymbol, tokenSupply);
  };

  return (
    <CreateTokenForm
      tokenName={tokenName}
      tokenSymbol={tokenSymbol}
      tokenSupply={tokenSupply}
      isConnected={isConnected}
      isAdmin={isAdmin}
      isWritingPending={isWritingPending}
      isConfirming={isConfirming}
      isConfirmed={isConfirmed}
      hash={hash}
      onTokenNameChange={setTokenName}
      onTokenSymbolChange={setTokenSymbol}
      onTokenSupplyChange={setTokenSupply}
      onSubmit={handleSubmit}
    />
  );
};
