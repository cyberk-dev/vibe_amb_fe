"use client";

import { useAppKit } from "@reown/appkit/react";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { ConnectButton } from "./connect-button";
import { WalletInfo } from "./wallet-info";
import { numberUtils } from "@/lib/helpers";

export const WalletConnectContainer = () => {
  const { open } = useAppKit();
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();

  const { data: balance } = useBalance({
    address: address,
    query: {
      enabled: !!address,
    },
  });

  const handleConnect = () => {
    open();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  if (isConnected && address) {
    return (
      <WalletInfo
        address={address}
        chainName={chain?.name || "Unknown"}
        balance={
          balance
            ? numberUtils.formatNumber(Number(balance.formatted), 0, 4)
            : "0.0000"
        }
        onDisconnect={handleDisconnect}
      />
    );
  }

  return <ConnectButton onConnect={handleConnect} isConnecting={false} />;
};
