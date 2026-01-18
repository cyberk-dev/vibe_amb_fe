"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";
import { PropsWithChildren } from "react";

const NETWORK =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "production"
    ? Network.MAINNET
    : Network.TESTNET;

export function AptosProvider({ children }: PropsWithChildren) {
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{
        network: NETWORK,
        aptosConnectDappId: process.env.NEXT_PUBLIC_APTOS_CONNECT_DAPP_ID,
      }}
      onError={(error) => {
        console.error("Aptos Wallet Error:", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
