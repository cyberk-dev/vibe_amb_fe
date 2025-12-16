"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useTokenBalance, useTokenInfo } from "@/hooks/onchain/evm/use-token-balance";
import { isAddress } from "viem";
import type { Address } from "viem";
import { TokenBalance } from "../_components/token-balance";

export const TokenBalanceContainer = () => {
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const { address: walletAddress, isConnected } = useAccount();

  const validTokenAddress = isAddress(tokenAddress) ? (tokenAddress as Address) : undefined;

  const {
    data: balance,
    isLoading: isLoadingBalance,
    refetch,
  } = useTokenBalance({
    tokenAddress: validTokenAddress,
    walletAddress,
  });

  const { name, symbol, decimals, totalSupply } = useTokenInfo(validTokenAddress);

  const handleCheckBalance = () => {
    refetch();
  };

  return (
    <TokenBalance
      tokenAddress={tokenAddress}
      validTokenAddress={validTokenAddress}
      walletAddress={walletAddress}
      isConnected={isConnected}
      balance={balance}
      isLoadingBalance={isLoadingBalance}
      name={name}
      symbol={symbol}
      decimals={decimals}
      totalSupply={totalSupply}
      onTokenAddressChange={setTokenAddress}
      onCheckBalance={handleCheckBalance}
    />
  );
};
