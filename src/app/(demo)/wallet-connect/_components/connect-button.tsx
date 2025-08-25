'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";

interface ConnectButtonProps {
  onConnect: () => void;
  isConnecting: boolean;
}

export const ConnectButton = ({ onConnect, isConnecting }: ConnectButtonProps) => {
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Wallet className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Connect Your Wallet</CardTitle>
        <CardDescription>
          Connect your wallet to interact with Web3 applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={onConnect} 
          disabled={isConnecting}
          size="lg"
          className="w-full"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      </CardContent>
    </Card>
  );
};