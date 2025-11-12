"use client";

import { type ReactNode } from "react";
import { AppKitProvider } from "@reown/appkit/react";
import { appKitConfig, wagmiAdapter } from "@/integrations/reown-appkit";
import { Config, cookieToInitialState, WagmiProvider } from "wagmi";

interface WalletProviderProps {
  children: ReactNode;
  cookies: string | null;
}

export const WalletProvider = ({ children, cookies }: WalletProviderProps) => {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);

  return (
    <AppKitProvider {...appKitConfig}>
      <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
        {children}
      </WagmiProvider>
    </AppKitProvider>
  );
};
