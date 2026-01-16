import { formatNumber } from "@/shared/lib/number";
import { Connection, useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useMemo } from "react";
import Decimal from "decimal.js";

const fetchBalance = async (connection: Connection, walletAddress: string): Promise<number> => {
  try {
    const wallet = new PublicKey(walletAddress);
    const balance = await connection.getBalance(wallet);
    return balance;
  } catch {
    // Return zero balance if address is invalid
    return 0;
  }
};

export type SolBalance = {
  balanceLamport: number;
  balanceFormatted: string;
  balanceInSOL: number;
};

export type UseSolBalanceParams = {
  address?: string;
  options?: UseQueryOptions<number, Error, SolBalance>;
};

export type UseSolBalanceReturn = UseQueryResult<SolBalance, Error>;

export const useSOLBalance = ({ address, options }: UseSolBalanceParams = {}): UseSolBalanceReturn => {
  const { connection } = useAppKitConnection();
  const { chainId } = useAppKitNetwork();

  const { address: connectedAddress } = useAppKitAccount();

  const targetAddress = address || connectedAddress;

  const selectBalance = useMemo(
    () =>
      (data: number): SolBalance => {
        const balanceInSOL = new Decimal(data).div(LAMPORTS_PER_SOL).toNumber();
        return {
          balanceLamport: data,
          balanceFormatted: formatNumber(balanceInSOL, 1, 3),
          balanceInSOL,
        };
      },
    [],
  );

  return useQuery({
    queryKey: ["sol-balance", targetAddress, chainId] as const,
    queryFn: async () => await fetchBalance(connection!, targetAddress!),
    enabled: Boolean(connection && targetAddress),
    select: selectBalance,
    staleTime: 10000, // Consider data fresh for 10 seconds
    refetchInterval: 10000, // Refetch every 10 seconds
    ...options,
  });
};
