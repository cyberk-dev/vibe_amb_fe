import { SolanaAdapter } from "@reown/appkit-adapter-solana";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { arbitrum, mainnet, polygon, solana, solanaDevnet, solanaTestnet } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { siweConfig } from "./siwe";
import { cookieStorage, createStorage } from "wagmi";

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

export const metadata = {
  name: "Cyberk Next.js Boilerplate",
  description: "Web3 wallet connection demo with AppKit and Wagmi",
  url: "https://cyberk-nextjs-boilerplate.vercel.app",
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
  networks: [mainnet, arbitrum, polygon],
  projectId,
});

export const networks: [AppKitNetwork, ...Array<AppKitNetwork>] = [
  mainnet,
  arbitrum,
  solana,
  solanaTestnet,
  solanaDevnet,
];

export const appKitConfig = {
  adapters: [wagmiAdapter, solanaWeb3JsAdapter],
  projectId,
  networks: networks,
  defaultNetwork: mainnet,
  metadata,
  features: {
    analytics: true,
  },
  siweConfig,
};

export const config = wagmiAdapter.wagmiConfig;
export const defaultChainId = mainnet.id;
