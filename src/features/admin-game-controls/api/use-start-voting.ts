import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  getAptosClient,
  buildFunctionPath,
  handleTransactionError,
  showTransactionPending,
  showTransactionSuccess,
} from "@/integrations/aptos";
import { gameQueries } from "@/entities/game";

export function useStartVoting() {
  const { account, signAndSubmitTransaction, connected } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!connected || !account?.address) {
        throw new Error("Wallet not connected");
      }

      showTransactionPending("Starting voting phase...");

      const payload = {
        function: buildFunctionPath("game", "start_voting"),
        typeArguments: [],
        functionArguments: [],
      };

      const response = await signAndSubmitTransaction({
        sender: account.address.toString(),
        data: payload,
      });

      const aptos = getAptosClient();
      const result = await aptos.waitForTransaction({ transactionHash: response.hash });

      if (!result.success) {
        throw new Error(result.vm_status || "Transaction failed");
      }

      return response.hash;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: gameQueries.all() });
      showTransactionSuccess("Voting phase started!");
    },
    onError: (error) => {
      handleTransactionError(error);
    },
  });
}
