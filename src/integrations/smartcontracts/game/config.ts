/**
 * Aptos Game Contract Configuration
 *
 * Contract addresses from vibe_amb_sc/addresses.json
 */

// Game contract module address
export const GAME_MODULE_ADDRESS = "0x79547205824a75e9cf206893ce4896e4b0cc244ab0815de1cd9603068e14700e";

// Full module paths
export const GAME_MODULE = `${GAME_MODULE_ADDRESS}::game`;
export const VAULT_MODULE = `${GAME_MODULE_ADDRESS}::vault`;

// Aptos network RPC URL (default to testnet)
export const APTOS_NETWORK = process.env.NEXT_PUBLIC_APTOS_NETWORK || "testnet";
export const APTOS_RPC_URL =
  APTOS_NETWORK === "mainnet" ? "https://fullnode.mainnet.aptoslabs.com" : "https://fullnode.testnet.aptoslabs.com";

// Game status constants
export enum GameStatus {
  PENDING = 0,
  SELECTION = 1,
  REVEALING = 2,
  VOTING = 3,
  ENDED = 4,
}

// Vote constants
export enum Vote {
  STOP = 0,
  CONTINUE = 1,
}

// Default payment asset (APT)
export const APT_METADATA = "0xa";
