"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { stringUtils } from "@/lib/helpers";
import { CheckCircle, Copy, LogOut } from "lucide-react";
import { useState } from "react";

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
  onDisconnect,
}: WalletInfoProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <CardTitle className="text-lg">Wallet Connected</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Address
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-2 py-1 bg-muted rounded text-sm font-mono">
                {stringUtils.truncateMiddle(address, 6, 4)}
              </code>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCopyAddress}
                className="h-8 w-8"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Network
            </label>
            <Badge variant="secondary" className="w-fit">
              {chainName}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Balance
          </label>
          <p className="text-2xl font-bold">{balance} ETH</p>
        </div>

        <Separator />

        <Button onClick={onDisconnect} variant="outline" className="w-full">
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect Wallet
        </Button>
      </CardContent>
    </Card>
  );
};
