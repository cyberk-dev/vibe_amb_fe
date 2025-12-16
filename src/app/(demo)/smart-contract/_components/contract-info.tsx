import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TOKEN_FACTORY_ADDRESS, CHAIN_ID } from "@/integrations/smartcontracts/token-factory";

interface ContractInfoProps {
  address?: string;
  isConnected: boolean;
  chainId?: number;
  defaultAdmin?: string;
  isAdmin?: boolean;
}

export const ContractInfo = ({ address, isConnected, chainId, defaultAdmin, isAdmin }: ContractInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Information</CardTitle>
        <CardDescription>
          TokenFactory contract deployed on {CHAIN_ID === 11155111 ? "Sepolia Testnet" : "Ethereum Mainnet"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Contract Address:</span>
            <a
              href={`https://sepolia.etherscan.io/address/${TOKEN_FACTORY_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-primary hover:underline"
            >
              {TOKEN_FACTORY_ADDRESS}
            </a>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Network:</span>
            <Badge variant={chainId === CHAIN_ID ? "default" : "secondary"}>
              {chainId === CHAIN_ID ? `${CHAIN_ID === 11155111 ? "Sepolia" : "Mainnet"} (Connected)` : "Wrong Network"}
            </Badge>
          </div>

          {isConnected && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Your Address:</span>
                <span className="text-xs font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Admin Status:</span>
                <Badge variant={isAdmin ? "default" : "secondary"}>{isAdmin ? "Admin" : "Not Admin"}</Badge>
              </div>
            </>
          )}

          {defaultAdmin && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Contract Owner:</span>
              <span className="text-xs font-mono">
                {defaultAdmin.slice(0, 6)}...{defaultAdmin.slice(-4)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
