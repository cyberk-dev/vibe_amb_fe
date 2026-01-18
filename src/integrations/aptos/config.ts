// Contract deployment info from docs/contract-integration.md
export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x79547205824a75e9cf206893ce4896e4b0cc244ab0815de1cd9603068e14700e";

export const DEPLOYER_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS;

export const PAYMENT_ASSET = "0xa"; // APT metadata address

// Module paths
export const GAME_MODULE = `${CONTRACT_ADDRESS}::game` as const;
export const VAULT_MODULE = `${CONTRACT_ADDRESS}::vault` as const;
export const WHITELIST_MODULE = `${CONTRACT_ADDRESS}::whitelist` as const;
export const ROUTER_MODULE = `${CONTRACT_ADDRESS}::router` as const;

// Build function path helper
export function buildFunctionPath(
  module: "game" | "vault" | "whitelist" | "router",
  functionName: string,
): `${string}::${string}::${string}` {
  return `${CONTRACT_ADDRESS}::${module}::${functionName}`;
}
