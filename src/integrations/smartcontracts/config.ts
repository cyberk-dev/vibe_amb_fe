import { Address } from "viem";
import { sepolia, mainnet } from "@reown/appkit/networks";

export const SEPOLIA_CONTRACTS = {
  TokenFactory: "0xFB8f729Eb8376a009f7F14CBd601Ac4439796E0b" as Address,
} as const;

export const MAINNET_CONTRACTS = {
  TokenFactory: "0x0000000000000000000000000000000000000000" as Address, // TODO: Add mainnet address when deployed
} as const;

const isTestnet = process.env.NEXT_PUBLIC_IS_TESTNET === "1";

export const CHAIN_CONFIG = {
  testnet: sepolia.id,
  mainnet: mainnet.id,
} as const;

export const getContracts = () => {
  return isTestnet ? SEPOLIA_CONTRACTS : MAINNET_CONTRACTS;
};

export const CONTRACTS = getContracts();

export const CHAIN_ID = isTestnet ? CHAIN_CONFIG.testnet : CHAIN_CONFIG.mainnet;

export const TOKEN_FACTORY_ADDRESS = CONTRACTS.TokenFactory;

export type SepoliaContractName = keyof typeof SEPOLIA_CONTRACTS;
export type MainnetContractName = keyof typeof MAINNET_CONTRACTS;
export type ContractName = SepoliaContractName | MainnetContractName;
