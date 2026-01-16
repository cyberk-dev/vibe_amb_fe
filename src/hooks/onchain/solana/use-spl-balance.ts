import { formatNumber } from "@/shared/lib/number";
import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useMemo } from "react";
import Decimal from "decimal.js";
import { useAppKitNetwork } from "@reown/appkit/react";

type FetchSPLBalanceResult = {
  balance: number;
  decimals: number;
};

/**
 * Fetches the SPL token balance for a given address and token mint
 */
const fetchSPLBalance = async (
  connection: Connection,
  walletAddress: string,
  mintAddress: string,
  tokenDecimal: number,
): Promise<FetchSPLBalanceResult> => {
  try {
    const walletPublicKey = new PublicKey(walletAddress);
    const mintPublicKey = new PublicKey(mintAddress);

    const associatedTokenAddress = await getAssociatedTokenAddress(mintPublicKey, walletPublicKey);

    const tokenAccountInfo = await connection.getTokenAccountBalance(associatedTokenAddress);

    return {
      balance: Number(tokenAccountInfo.value.amount),
      decimals: tokenAccountInfo.value.decimals,
    };
  } catch {
    return {
      balance: 0,
      decimals: tokenDecimal,
    };
  }
};

export type SPLBalance = {
  balanceRaw: number;
  balanceFormatted: string;
  balanceInTokens: number;
  decimals: number;
};

export type UseSPLBalanceParams = {
  address: string;
  mintAddress: string;
  decimals: number;
  options?: UseQueryOptions<FetchSPLBalanceResult, Error, SPLBalance>;
};

export type UseSPLBalanceReturn = UseQueryResult<SPLBalance, Error>;

/**
 * Hook to fetch and manage SPL token balance for a given address and mint
 */
export const useSPLBalance = ({
  address,
  mintAddress,
  decimals,
  options,
}: UseSPLBalanceParams): UseSPLBalanceReturn => {
  const { connection } = useAppKitConnection();
  const { chainId } = useAppKitNetwork();

  // Use provided address or fall back to connected account
  const targetAddress = address;

  // Memoize the select function to avoid recreating it on every render
  const selectBalance = useMemo(
    () =>
      (data: FetchSPLBalanceResult): SPLBalance => {
        const balanceInTokens = new Decimal(data.balance).div(new Decimal(10).pow(data.decimals)).toNumber();
        return {
          balanceRaw: data.balance,
          balanceFormatted: formatNumber(balanceInTokens),
          balanceInTokens,
          decimals: data.decimals,
        };
      },
    [],
  );

  return useQuery({
    queryKey: ["spl-balance", targetAddress, mintAddress, chainId] as const,
    queryFn: () => fetchSPLBalance(connection!, targetAddress!, mintAddress, decimals),
    enabled: Boolean(connection && targetAddress && mintAddress),
    select: selectBalance,
    staleTime: 30000, // Consider data fresh for 30 seconds
    ...options,
  });
};
