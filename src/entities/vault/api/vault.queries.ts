import { queryOptions } from "@tanstack/react-query";
import { vaultViewService } from "./vault-views";
import { PAYMENT_ASSET } from "@/integrations/aptos";

export const vaultQueries = {
  all: () => ["vault"] as const,

  claimable: (userAddress: string, assetMetadata: string = PAYMENT_ASSET) =>
    queryOptions({
      queryKey: [...vaultQueries.all(), "claimable", userAddress, assetMetadata],
      queryFn: () => vaultViewService.getClaimableBalance(userAddress, assetMetadata),
      staleTime: 10_000,
      enabled: !!userAddress,
    }),

  balance: (assetMetadata: string = PAYMENT_ASSET) =>
    queryOptions({
      queryKey: [...vaultQueries.all(), "balance", assetMetadata],
      queryFn: () => vaultViewService.getVaultBalance(assetMetadata),
      staleTime: 30_000,
    }),
};
