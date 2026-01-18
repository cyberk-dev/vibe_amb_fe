import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "sonner";
import { buildFunctionPath, parseContractError, getAptosClient, isAlreadyRegisteredError } from "@/integrations/aptos";
import { whitelistQueries } from "@/entities/whitelist";

export function useRegisterWhitelist() {
  const { signAndSubmitTransaction, account } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!account?.address) {
        throw new Error("Wallet not connected");
      }

      const response = await signAndSubmitTransaction({
        sender: account.address.toString(),
        data: {
          function: buildFunctionPath("whitelist", "register"),
          typeArguments: [],
          functionArguments: [],
        },
      });

      const aptos = getAptosClient();
      const result = await aptos.waitForTransaction({ transactionHash: response.hash });

      if (!result.success) {
        throw new Error(result.vm_status || "Registration failed");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: whitelistQueries.all() });
      toast.success("Registration successful!");
    },
    onError: async (error) => {
      if (isAlreadyRegisteredError(error)) {
        await queryClient.invalidateQueries({ queryKey: whitelistQueries.all() });
        return;
      }

      toast.error(parseContractError(error));
    },
  });
}
