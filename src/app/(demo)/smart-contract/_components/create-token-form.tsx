import { CtaButton } from "@/shared/ui/cta-button";
import { Input } from "@/shared/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import { CHAIN_ID } from "@/integrations/smartcontracts/token-factory";

interface CreateTokenFormProps {
  tokenName: string;
  tokenSymbol: string;
  tokenSupply: string;
  isConnected: boolean;
  isAdmin?: boolean;
  isWritingPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  hash?: string;
  onTokenNameChange: (value: string) => void;
  onTokenSymbolChange: (value: string) => void;
  onTokenSupplyChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CreateTokenForm = ({
  tokenName,
  tokenSymbol,
  tokenSupply,
  isConnected,
  isAdmin,
  isWritingPending,
  isConfirming,
  isConfirmed,
  hash,
  onTokenNameChange,
  onTokenSymbolChange,
  onTokenSupplyChange,
  onSubmit,
}: CreateTokenFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Token</CardTitle>
        <CardDescription>
          Deploy a new ERC20 token using the TokenFactory contract. Requires DEFAULT_ADMIN_ROLE.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tokenName">Token Name</Label>
            <Input
              id="tokenName"
              placeholder="e.g., My Token"
              value={tokenName}
              onChange={(e) => onTokenNameChange(e.target.value)}
              disabled={isWritingPending || isConfirming}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tokenSymbol">Token Symbol</Label>
            <Input
              id="tokenSymbol"
              placeholder="e.g., MTK"
              value={tokenSymbol}
              onChange={(e) => onTokenSymbolChange(e.target.value)}
              disabled={isWritingPending || isConfirming}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tokenSupply">Initial Supply (tokens)</Label>
            <Input
              id="tokenSupply"
              type="number"
              placeholder="e.g., 1000000"
              value={tokenSupply}
              onChange={(e) => onTokenSupplyChange(e.target.value)}
              disabled={isWritingPending || isConfirming}
              min="1"
            />
          </div>

          {isConnected && isAdmin === false && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">
                Your address does not have the DEFAULT_ADMIN_ROLE required to create tokens.
              </p>
            </div>
          )}

          {isConnected && isAdmin === true && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-sm text-green-800 dark:text-green-200">You have admin privileges to create tokens.</p>
            </div>
          )}

          <CtaButton
            type="submit"
            disabled={!isAdmin || isWritingPending || isConfirming}
            sending={isWritingPending}
            loading={isConfirming}
            smartContractChainId={CHAIN_ID}
            className="w-full"
          >
            Create Token
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
                Token created successfully! Check the transaction on Etherscan.
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
