import { WHITELIST_MODULE } from "@/integrations/aptos";
import { viewProxy } from "@/integrations/aptos/utils/view-proxy";

class WhitelistViewService {
  async isRegistered(address: string): Promise<boolean> {
    const [result] = await viewProxy<[boolean]>({
      function: `${WHITELIST_MODULE}::is_registered`,
      typeArguments: [],
      functionArguments: [address],
    });
    return result;
  }

  async getInviteCode(address: string): Promise<string> {
    const [code] = await viewProxy<[string]>({
      function: `${WHITELIST_MODULE}::get_invite_code`,
      typeArguments: [],
      functionArguments: [address],
    });
    return code;
  }

  async getRegisteredCount(): Promise<number> {
    const [count] = await viewProxy<[string]>({
      function: `${WHITELIST_MODULE}::get_registered_count`,
      typeArguments: [],
      functionArguments: [],
    });
    return Number(count);
  }
}

export const whitelistViewService = new WhitelistViewService();
