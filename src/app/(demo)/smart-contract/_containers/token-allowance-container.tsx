"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useTokenAllowance, useApproveTokenAllowance } from "@/hooks/onchain/evm/use-token-allowance";
import { useTokenInfo } from "@/hooks/onchain/evm/use-token-balance";
import { toast } from "sonner";
import { isAddress } from "viem";
import type { Address } from "viem";
import { TokenAllowance } from "../_components/token-allowance";

export const TokenAllowanceContainer = () => {
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [spenderAddress, setSpenderAddress] = useState<string>("");
  const [approvalAmount, setApprovalAmount] = useState<string>("");

  const { address: walletAddress } = useAccount();

  const validTokenAddress = isAddress(tokenAddress) ? (tokenAddress as Address) : undefined;
  const validSpenderAddress = isAddress(spenderAddress) ? (spenderAddress as Address) : undefined;

  const { symbol, decimals } = useTokenInfo(validTokenAddress);

  const { data: allowance, refetch: refetchAllowance } = useTokenAllowance({
    tokenAddress: validTokenAddress,
    ownerAddress: walletAddress,
    spenderAddress: validSpenderAddress,
  });

  const { approve, isConfirming, isConfirmed, isWritingPending, hash } = useApproveTokenAllowance({
    tokenAddress: validTokenAddress,
    onSuccess: (receipt) => {
      toast.success("Approval successful!", {
        description: `Transaction hash: ${receipt.transactionHash}`,
      });
      refetchAllowance();
      setApprovalAmount("");
    },
    onError: (error) => {
      toast.error("Approval failed", {
        description: error.shortMessage || error.details || "Unknown error occurred",
      });
    },
  });

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validTokenAddress || !validSpenderAddress || !approvalAmount) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await approve(validSpenderAddress, approvalAmount, decimals);
    } catch (error) {
      console.error("Approval error:", error);
    }
  };

  const handleMaxApproval = () => {
    // Max uint256 value for unlimited approval
    setApprovalAmount("115792089237316195423570985008687907853269984665640564039457");
  };

  return (
    <TokenAllowance
      tokenAddress={tokenAddress}
      spenderAddress={spenderAddress}
      approvalAmount={approvalAmount}
      validTokenAddress={validTokenAddress}
      validSpenderAddress={validSpenderAddress}
      allowance={allowance}
      symbol={symbol}
      decimals={decimals}
      isWritingPending={isWritingPending}
      isConfirming={isConfirming}
      isConfirmed={isConfirmed}
      hash={hash}
      onTokenAddressChange={setTokenAddress}
      onSpenderAddressChange={setSpenderAddress}
      onApprovalAmountChange={setApprovalAmount}
      onApprove={handleApprove}
      onMaxApproval={handleMaxApproval}
    />
  );
};
