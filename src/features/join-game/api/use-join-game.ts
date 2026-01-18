import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "sonner";
import { buildFunctionPath, parseContractError, getAptosClient } from "@/integrations/aptos";
import { gameQueries } from "@/entities/game";

interface JoinGameParams {
  code: string;
  displayName: string;
}

export function useJoinGame() {
  const { signAndSubmitTransaction, account } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ code, displayName }: JoinGameParams) => {
      if (!account?.address) {
        throw new Error("Wallet not connected");
      }

      const response = await signAndSubmitTransaction({
        sender: account.address.toString(),
        data: {
          function: buildFunctionPath("game", "join_game"),
          typeArguments: [],
          functionArguments: [code, displayName],
        },
      });

      const aptos = getAptosClient();
      const result = await aptos.waitForTransaction({ transactionHash: response.hash });

      if (!result.success) {
        throw new Error(result.vm_status || "Failed to join game");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gameQueries.all() });
      toast.success("Welcome to the game!");
    },
    onError: (error) => {
      toast.error(parseContractError(error));
    },
  });
}
