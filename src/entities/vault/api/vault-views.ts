import { getAptosClient, VAULT_MODULE, PAYMENT_ASSET } from "@/integrations/aptos";

class VaultViewService {
  private get aptos() {
    return getAptosClient();
  }

  async getClaimableBalance(userAddress: string, assetMetadata: string = PAYMENT_ASSET): Promise<bigint> {
    try {
      const [balance] = await this.aptos.view<[string]>({
        payload: {
          function: `${VAULT_MODULE}::get_claimable_balance`,
          typeArguments: [],
          functionArguments: [userAddress, assetMetadata],
        },
      });
      return BigInt(balance);
    } catch {
      return BigInt(0);
    }
  }

  async getVaultBalance(assetMetadata: string = PAYMENT_ASSET): Promise<bigint> {
    try {
      const [balance] = await this.aptos.view<[string]>({
        payload: {
          function: `${VAULT_MODULE}::get_balance`,
          typeArguments: [],
          functionArguments: [assetMetadata],
        },
      });
      return BigInt(balance);
    } catch {
      return BigInt(0);
    }
  }
}

export const vaultViewService = new VaultViewService();
