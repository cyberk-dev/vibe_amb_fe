"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PropsWithChildren, useMemo } from "react";
import { aptosClient, NETWORK } from "./client";

export function AptosProviderInner({ children }: PropsWithChildren) {
  const dappConfig = useMemo(
    () => ({
      network: NETWORK,
      aptosConnectDappId: process.env.NEXT_PUBLIC_APTOS_CONNECT_DAPP_ID,
      transactionSubmitter: aptosClient.config.getTransactionSubmitter(),
    }),
    [],
  );

  return (
    <AptosWalletAdapterProvider autoConnect={true} dappConfig={dappConfig} onError={console.error}>
      {children}
    </AptosWalletAdapterProvider>
  );
}
