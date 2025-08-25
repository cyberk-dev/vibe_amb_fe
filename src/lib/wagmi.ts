import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, arbitrum, polygon } from 'viem/chains';

// Get projectId from environment variable
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is required');
}

// Set up the Wagmi Adapter with supported chains
export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  networks: [mainnet, arbitrum, polygon],
  projectId,
});

// Configure the metadata
const metadata = {
  name: 'Cyberk Next.js Boilerplate',
  description: 'Web3 wallet connection demo with AppKit and Wagmi',
  url: 'https://cyberk-nextjs-boilerplate.vercel.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

// Create the AppKit instance
export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum, polygon],
  defaultNetwork: mainnet,
  metadata,
  features: {
    analytics: true,
  },
});

export const config = wagmiAdapter.wagmiConfig;