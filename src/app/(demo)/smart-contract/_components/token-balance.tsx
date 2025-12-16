import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { formatUnits } from "viem";
import type { Address } from "viem";

interface TokenBalanceProps {
  tokenAddress: string;
  validTokenAddress?: Address;
  walletAddress?: Address;
  isConnected: boolean;
  balance?: bigint;
  isLoadingBalance: boolean;
  name?: string;
  symbol?: string;
  decimals: number;
  totalSupply?: bigint;
  onTokenAddressChange: (value: string) => void;
  onCheckBalance: () => void;
}

export const TokenBalance = ({
  tokenAddress,
  validTokenAddress,
  walletAddress,
  isConnected,
  balance,
  isLoadingBalance,
  name,
  symbol,
  decimals,
  totalSupply,
  onTokenAddressChange,
  onCheckBalance,
}: TokenBalanceProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Token Balance</CardTitle>
        <CardDescription>View your ERC20 token balance by entering the token contract address.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tokenAddress">Token Contract Address</Label>
          <Input
            id="tokenAddress"
            placeholder="0x..."
            value={tokenAddress}
            onChange={(e) => onTokenAddressChange(e.target.value)}
          />
        </div>

        {!isConnected && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">Please connect your wallet to check balance.</p>
          </div>
        )}

        <Button
          onClick={onCheckBalance}
          disabled={isLoadingBalance || !isConnected || !validTokenAddress}
          className="w-full"
        >
          {isLoadingBalance ? "Checking..." : "Check Balance"}
        </Button>

        {validTokenAddress && name && (
          <div className="space-y-3 p-4 bg-muted rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Token Name:</span>
              <span className="text-sm">{name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Symbol:</span>
              <span className="text-sm">{symbol}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Decimals:</span>
              <span className="text-sm">{decimals}</span>
            </div>
            {totalSupply && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Supply:</span>
                <span className="text-sm font-mono">{formatUnits(totalSupply, decimals)}</span>
              </div>
            )}
          </div>
        )}

        {balance !== undefined && validTokenAddress && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-md">
            <p className="text-sm font-medium mb-1">Your Balance:</p>
            <p className="text-2xl font-bold font-mono">
              {formatUnits(balance, decimals)} {symbol}
            </p>
            {walletAddress && (
              <p className="text-xs text-muted-foreground mt-2">
                Address: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
