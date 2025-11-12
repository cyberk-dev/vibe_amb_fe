"use client";

import { useSOLBalance } from "@/hooks/onchain/solana/use-sol-balance";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { useAccount, useBalance } from "wagmi";

export const useWalletInfo = () => {
  const { address, isConnected } = useAppKitAccount();
  const { caipNetwork, caipNetworkId } = useAppKitNetwork();

  // Detect if current network is Solana
  const isSolana = caipNetworkId?.startsWith("solana:");

  // EVM hooks
  const { chain } = useAccount();
  const { data: evmBalance, isLoading: isEvmBalanceLoading } = useBalance({
    address: address as `0x${string}`,
    query: {
      enabled: !!address && !isSolana,
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  });

  // Solana hook
  const { data: solanaBalance, isLoading: isSolanaBalanceLoading, refetch: refetchSolanaBalance } = useSOLBalance();

  const balance = isSolana
    ? {
        value: BigInt(solanaBalance?.balanceLamport || 0),
        decimals: 9,
        symbol: "SOL",
        formatted: solanaBalance?.balanceFormatted || "0.000",
      }
    : evmBalance;

  const networkName = isSolana ? caipNetwork?.name || "Solana" : chain?.name || "Unknown";

  const isBalanceLoading = isSolana ? isSolanaBalanceLoading : isEvmBalanceLoading;

  return {
    address,
    isConnected,
    isSolana,
    balance,
    networkName,
    chainId: caipNetwork?.id,
    isBalanceLoading,
    refetchBalance: isSolana ? refetchSolanaBalance : undefined,
  };
};
