"use client";

import { useDisconnect } from "@reown/appkit/react";
import { ConnectWalletButton } from "@/features/wallet";
import { WalletInfo } from "./wallet-info";
import { numberUtils } from "@/shared/lib";
import { useWalletInfo } from "@/hooks/use-wallet-info";

export const WalletConnectContainer = () => {
  const { disconnect } = useDisconnect();
  const { address, isConnected, balance, networkName, isSolana } = useWalletInfo();

  const handleDisconnect = () => {
    disconnect();
  };

  if (isConnected && address) {
    return (
      <WalletInfo
        address={address}
        chainName={networkName}
        balance={balance ? numberUtils.formatNumber(Number(balance.formatted), 0, 4) : "0.0000"}
        currency={balance?.symbol || (isSolana ? "SOL" : "ETH")}
        onDisconnect={handleDisconnect}
      />
    );
  }

  return <ConnectWalletButton isFullWidth />;
};
