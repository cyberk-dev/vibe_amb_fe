import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Decimal from "decimal.js";
import {
  getAptosClient,
  buildFunctionPath,
  handleTransactionError,
  showTransactionPending,
  showTransactionSuccess,
  PAYMENT_ASSET,
} from "@/integrations/aptos";
import { vaultQueries } from "@/entities/vault";

export function useFundVault() {
  const { account, signAndSubmitTransaction, connected } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amountAptString: string) => {
      if (!connected || !account?.address) {
        throw new Error("Wallet not connected");
      }

      // Convert APT string to Octas (1 APT = 1e8 Octas)
      const amountApt = new Decimal(amountAptString);
      const amountOctas = amountApt.mul(1e8).floor().toString();

      if (amountApt.lte(0)) {
        throw new Error("Amount must be greater than 0");
      }

      showTransactionPending("Funding vault...");

      const response = await signAndSubmitTransaction({
        sender: account.address.toString(),
        data: {
          function: buildFunctionPath("vault", "fund_vault"),
          typeArguments: [],
          functionArguments: [PAYMENT_ASSET, amountOctas.toString()],
        },
      });

      const aptos = getAptosClient();
      const result = await aptos.waitForTransaction({ transactionHash: response.hash });

      if (!result.success) {
        throw new Error(result.vm_status || "Transaction failed");
      }

      return response.hash;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: vaultQueries.all() });
      showTransactionSuccess("Vault funded successfully!");
    },
    onError: (error) => {
      handleTransactionError(error);
    },
  });
}
