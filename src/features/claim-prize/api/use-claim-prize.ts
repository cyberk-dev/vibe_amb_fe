import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getAptosClient, buildFunctionPath, PAYMENT_ASSET } from "@/integrations/aptos";
import { vaultQueries } from "@/entities/vault";
import { gameQueries } from "@/entities/game";

export function useClaimPrize() {
  const { signAndSubmitTransaction, account } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!account?.address) throw new Error("Wallet not connected");

      const response = await signAndSubmitTransaction({
        sender: account.address.toString(),
        data: {
          function: buildFunctionPath("vault", "claim_prizes"),
          typeArguments: [],
          functionArguments: [PAYMENT_ASSET],
        },
      });

      await getAptosClient().waitForTransaction({ transactionHash: response.hash });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vaultQueries.all() });
      queryClient.invalidateQueries({ queryKey: gameQueries.all() });
    },
  });
}
