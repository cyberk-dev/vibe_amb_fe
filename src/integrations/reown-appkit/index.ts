import { SolanaAdapter } from "@reown/appkit-adapter-solana";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { arbitrum, mainnet, polygon, sepolia, solana, solanaDevnet, solanaTestnet } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { siweConfig } from "./siwe";
import { cookieStorage, createStorage } from "wagmi";

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

export const metadata = {
  name: "H.O.T.Y",
  description: "Web3 wallet connection for H.O.T.Y",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

export const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new SolflareWalletAdapter()],
});

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  networks: [mainnet, arbitrum, polygon, sepolia],
  projectId,
});

export const networks: [AppKitNetwork, ...Array<AppKitNetwork>] = [
  mainnet,
  arbitrum,
  sepolia,
  solana,
  solanaTestnet,
  solanaDevnet,
];

export const appKitConfig = {
  adapters: [wagmiAdapter, solanaWeb3JsAdapter],
  projectId,
  networks: networks,
  defaultNetwork: sepolia,
  metadata,
  features: {
    analytics: true,
  },
  siweConfig,
};

export const config = wagmiAdapter.wagmiConfig;
export const defaultChainId = mainnet.id;
