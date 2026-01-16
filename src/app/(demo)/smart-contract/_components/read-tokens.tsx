import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";

interface ReadTokensProps {
  tokenIndex: number;
  tokenAddress?: string;
  isLoading: boolean;
  isError: boolean;
  onTokenIndexChange: (index: number) => void;
  onReadToken: () => void;
}

export const ReadTokens = ({
  tokenIndex,
  tokenAddress,
  isLoading,
  isError,
  onTokenIndexChange,
  onReadToken,
}: ReadTokensProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Read Token Address</CardTitle>
        <CardDescription>
          Query the TokenFactory contract to get the address of a deployed token by its index.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tokenIndex">Token Index</Label>
          <Input
            id="tokenIndex"
            type="number"
            placeholder="Enter token index (e.g., 0)"
            value={tokenIndex}
            onChange={(e) => onTokenIndexChange(parseInt(e.target.value) || 0)}
            min={0}
          />
        </div>
        <Button onClick={onReadToken} disabled={isLoading} className="w-full">
          {isLoading ? "Reading..." : "Read Token Address"}
        </Button>

        {tokenAddress && (
          <div className="p-4 bg-muted rounded-md">
            <p className="text-sm font-medium mb-1">Token Address at index {tokenIndex}:</p>
            <p className="text-xs font-mono break-all">{tokenAddress}</p>
          </div>
        )}

        {isError && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md">
            <p className="text-sm">Error: Token not found at this index or contract read failed.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
