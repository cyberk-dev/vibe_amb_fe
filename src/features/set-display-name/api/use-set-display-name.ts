import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "sonner";
import { buildFunctionPath, parseContractError, getAptosClient } from "@/integrations/aptos";
import { gameQueries } from "@/entities/game";

interface SetDisplayNameParams {
  code: string;
  name: string;
}

export function useSetDisplayName() {
  const { signAndSubmitTransaction, account } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ code, name }: SetDisplayNameParams) => {
      if (!account?.address) throw new Error("Wallet not connected");

      const response = await signAndSubmitTransaction({
        sender: account.address.toString(),
        data: {
          function: buildFunctionPath("game", "set_display_name"),
          typeArguments: [],
          functionArguments: [code, name],
        },
      });

      const aptos = getAptosClient();
      await aptos.waitForTransaction({ transactionHash: response.hash });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gameQueries.all() });
      toast.success("Name saved!");
    },
    onError: (error) => {
      toast.error(parseContractError(error));
    },
  });
}
