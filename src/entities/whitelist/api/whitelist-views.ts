import { getAptosClient, WHITELIST_MODULE } from "@/integrations/aptos";

class WhitelistViewService {
  private get aptos() {
    return getAptosClient();
  }

  async isRegistered(address: string): Promise<boolean> {
    const [result] = await this.aptos.view<[boolean]>({
      payload: {
        function: `${WHITELIST_MODULE}::is_registered`,
        typeArguments: [],
        functionArguments: [address],
      },
    });
    return result;
  }

  async getInviteCode(address: string): Promise<string> {
    const [code] = await this.aptos.view<[string]>({
      payload: {
        function: `${WHITELIST_MODULE}::get_invite_code`,
        typeArguments: [],
        functionArguments: [address],
      },
    });
    return code;
  }

  async getRegisteredCount(): Promise<number> {
    const [count] = await this.aptos.view<[string]>({
      payload: {
        function: `${WHITELIST_MODULE}::get_registered_count`,
        typeArguments: [],
        functionArguments: [],
      },
    });
    return Number(count);
  }
}

export const whitelistViewService = new WhitelistViewService();
