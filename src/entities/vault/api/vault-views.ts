import { VAULT_MODULE, PAYMENT_ASSET } from "@/integrations/aptos";
import { viewProxy } from "@/integrations/aptos/utils/view-proxy";

class VaultViewService {
  async getClaimableBalance(userAddress: string, assetMetadata: string = PAYMENT_ASSET): Promise<bigint> {
    try {
      const [balance] = await viewProxy<[string]>({
        function: `${VAULT_MODULE}::get_claimable_balance`,
        typeArguments: [],
        functionArguments: [userAddress, assetMetadata],
      });
      return BigInt(balance);
    } catch {
      return BigInt(0);
    }
  }

  async getVaultBalance(assetMetadata: string = PAYMENT_ASSET): Promise<bigint> {
    try {
      const [balance] = await viewProxy<[string]>({
        function: `${VAULT_MODULE}::get_balance`,
        typeArguments: [],
        functionArguments: [assetMetadata],
      });
      return BigInt(balance);
    } catch {
      return BigInt(0);
    }
  }
}

export const vaultViewService = new VaultViewService();
