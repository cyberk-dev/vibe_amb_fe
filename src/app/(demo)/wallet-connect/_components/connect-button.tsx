'use client';

import { Button } from "@/components/ui/button";

interface ConnectButtonProps {
  onConnect: () => void;
  isConnecting: boolean;
}

export const ConnectButton = ({ onConnect, isConnecting }: ConnectButtonProps) => {
  return (
    <div className="p-6 border rounded-lg bg-card text-center">
      <h3 className="text-lg font-semibold mb-4">Connect Your Wallet</h3>
      <p className="text-muted-foreground mb-6">
        Connect your wallet to interact with Web3 applications
      </p>
      
      <Button 
        onClick={onConnect} 
        disabled={isConnecting}
        size="lg"
        className="w-full"
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    </div>
  );
};