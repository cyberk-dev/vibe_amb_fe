'use client';

import { WagmiProvider } from 'wagmi';
import { type ReactNode } from 'react';
import { config } from '@/lib/wagmi';
import { QueryProvider } from './query-provider';

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  return (
    <WagmiProvider config={config}>
      <QueryProvider>
        {children}
      </QueryProvider>
    </WagmiProvider>
  );
};