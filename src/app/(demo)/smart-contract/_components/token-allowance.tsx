import { CtaButton } from "@/shared/ui/cta-button";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import { formatUnits } from "viem";
import type { Address } from "viem";
import { CHAIN_ID } from "@/integrations/smartcontracts/token-factory";

interface TokenAllowanceProps {
  tokenAddress: string;
  spenderAddress: string;
  approvalAmount: string;
  validTokenAddress?: Address;
  validSpenderAddress?: Address;
  allowance?: bigint;
  symbol?: string;
  decimals: number;
  isWritingPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  hash?: string;
  onTokenAddressChange: (value: string) => void;
  onSpenderAddressChange: (value: string) => void;
  onApprovalAmountChange: (value: string) => void;
  onApprove: (e: React.FormEvent) => void;
  onMaxApproval: () => void;
}

export const TokenAllowance = ({
  tokenAddress,
  spenderAddress,
  approvalAmount,
  validTokenAddress,
  validSpenderAddress,
  allowance,
  symbol,
  decimals,
  isWritingPending,
  isConfirming,
  isConfirmed,
  hash,
  onTokenAddressChange,
  onSpenderAddressChange,
  onApprovalAmountChange,
  onApprove,
  onMaxApproval,
}: TokenAllowanceProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Allowance & Approval</CardTitle>
        <CardDescription>
          Check and approve token spending allowances for smart contracts or other addresses.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tokenAddressAllowance">Token Contract Address</Label>
          <Input
            id="tokenAddressAllowance"
            placeholder="0x..."
            value={tokenAddress}
            onChange={(e) => onTokenAddressChange(e.target.value)}
            disabled={isWritingPending || isConfirming}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="spenderAddress">Spender Address</Label>
          <Input
            id="spenderAddress"
            placeholder="0x... (contract or wallet address)"
            value={spenderAddress}
            onChange={(e) => onSpenderAddressChange(e.target.value)}
            disabled={isWritingPending || isConfirming}
          />
        </div>

        {allowance !== undefined && validTokenAddress && validSpenderAddress && (
          <div className="p-4 bg-muted rounded-md">
            <p className="text-sm font-medium mb-1">Current Allowance:</p>
            <p className="text-lg font-bold font-mono">
              {formatUnits(allowance, decimals)} {symbol}
            </p>
          </div>
        )}

        <form onSubmit={onApprove} className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="approvalAmount">Approval Amount</Label>
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={onMaxApproval}
                disabled={isWritingPending || isConfirming}
                className="h-auto p-0"
              >
                Max
              </Button>
            </div>
            <Input
              id="approvalAmount"
              type="text"
              placeholder="e.g., 1000"
              value={approvalAmount}
              onChange={(e) => onApprovalAmountChange(e.target.value)}
              disabled={isWritingPending || isConfirming}
            />
            {symbol && <p className="text-xs text-muted-foreground">Amount in {symbol} tokens</p>}
          </div>

          <CtaButton
            type="submit"
            disabled={!validTokenAddress || !validSpenderAddress || !approvalAmount || isWritingPending || isConfirming}
            sending={isWritingPending}
            loading={isConfirming}
            smartContractChainId={CHAIN_ID}
            className="w-full"
          >
            Approve Allowance
          </CtaButton>

          {hash && (
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm font-medium mb-1">Transaction Hash:</p>
              <a
                href={`https://sepolia.etherscan.io/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono break-all text-primary hover:underline"
              >
                {hash}
              </a>
            </div>
          )}

          {isConfirmed && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-sm text-green-800 dark:text-green-200">
                Approval successful! The spender can now use your tokens.
              </p>
            </div>
          )}
        </form>

        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> Approving allowances gives the spender permission to spend your tokens. Only approve
            trusted contracts or addresses. Click &quot;Max&quot; for unlimited approval (not recommended for untrusted
            contracts).
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
