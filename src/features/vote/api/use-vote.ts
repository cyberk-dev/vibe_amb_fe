import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "sonner";
import { buildFunctionPath, parseContractError, getAptosClient, Vote } from "@/integrations/aptos";
import { gameQueries } from "@/entities/game";

export function useVote() {
  const { signAndSubmitTransaction, account } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (choice: Vote) => {
      if (!account?.address) throw new Error("Wallet not connected");

      const response = await signAndSubmitTransaction({
        sender: account.address.toString(),
        data: {
          function: buildFunctionPath("game", "vote"),
          typeArguments: [],
          functionArguments: [choice], // 0 = STOP, 1 = CONTINUE
        },
      });

      const aptos = getAptosClient();
      await aptos.waitForTransaction({ transactionHash: response.hash });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gameQueries.all() });
      toast.success("Vote submitted!");
    },
    onError: (error) => {
      const message = parseContractError(error);
      toast.error(message);
    },
  });
}
