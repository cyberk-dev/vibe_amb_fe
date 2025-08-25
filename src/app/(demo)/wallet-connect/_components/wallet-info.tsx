'use client';

import { Button } from "@/components/ui/button";
import { stringUtils } from "@/libs/helpers";

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

  return (
    <div className="p-6 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold mb-4">Wallet Connected</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Address</label>
            <p className="font-mono text-sm">{stringUtils.truncateMiddle(address, 6, 4)}</p>
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