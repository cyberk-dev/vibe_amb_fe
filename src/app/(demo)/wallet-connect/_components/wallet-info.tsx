'use client';

import { Button } from "@/components/ui/button";

interface WalletInfoProps {
  address: string;
  chainName: string;
  balance: string;
  onDisconnect: () => void;
}

export const WalletInfo = ({ 
  address, 
  chainName, 
  balance, 
  onDisconnect 
}: WalletInfoProps) => {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="p-6 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold mb-4">Wallet Connected</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Address</label>
            <p className="font-mono text-sm">{formatAddress(address)}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Chain</label>
            <p className="text-sm">{chainName}</p>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-muted-foreground">Balance</label>
          <p className="text-lg font-semibold">{balance} ETH</p>
        </div>
        
        <Button 
          onClick={onDisconnect} 
          variant="outline" 
          className="w-full mt-4"
        >
          Disconnect Wallet
        </Button>
      </div>
    </div>
  );
};