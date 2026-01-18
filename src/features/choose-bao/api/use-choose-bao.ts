import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "sonner";
import { buildFunctionPath, parseContractError, getAptosClient } from "@/integrations/aptos";
import { gameQueries } from "@/entities/game";

interface ChooseBaoParams {
  targetAddress: string;
}

export function useChooseBao() {
  const { signAndSubmitTransaction, account } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ targetAddress }: ChooseBaoParams) => {
      if (!account?.address) throw new Error("Wallet not connected");

      const response = await signAndSubmitTransaction({
        sender: account.address.toString(),
        data: {
          function: buildFunctionPath("game", "choose_bao"),
          typeArguments: [],
          functionArguments: [targetAddress],
        },
      });

      const aptos = getAptosClient();
      await aptos.waitForTransaction({ transactionHash: response.hash });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gameQueries.all() });
      toast.success("Bao assigned!");
    },
    onError: (error) => {
      const message = parseContractError(error);
      toast.error(message);
    },
  });
}
