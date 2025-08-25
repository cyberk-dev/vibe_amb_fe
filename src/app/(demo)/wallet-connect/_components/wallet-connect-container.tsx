'use client';

import { useAppKit } from '@reown/appkit/react';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { ConnectButton } from './connect-button';
import { WalletInfo } from './wallet-info';

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
        chainName={chain?.name || 'Unknown'}
        balance={balance ? Number(balance.formatted).toFixed(4) : '0.0000'}
        onDisconnect={handleDisconnect}
      />
    );
  }

  return (
    <ConnectButton 
      onConnect={handleConnect} 
      isConnecting={false}
    />
  );
};