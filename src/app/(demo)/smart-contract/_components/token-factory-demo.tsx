"use client";

import { ContractInfoContainer } from "../_containers/contract-info-container";
import { ReadTokensContainer } from "../_containers/read-tokens-container";
import { CreateTokenFormContainer } from "../_containers/create-token-form-container";
import { TokenBalanceContainer } from "../_containers/token-balance-container";
import { TokenAllowanceContainer } from "../_containers/token-allowance-container";
import { Separator } from "@/components/ui/separator";

export const TokenFactoryDemo = () => {
  return (
    <div className="space-y-6">
      <ContractInfoContainer />

      <Separator />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Token Factory Operations</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <ReadTokensContainer />
          <CreateTokenFormContainer />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">ERC20 Token Operations</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <TokenBalanceContainer />
          <TokenAllowanceContainer />
        </div>
      </div>

      <div className="p-4 bg-muted/50 rounded-md text-sm text-muted-foreground">
        <p className="font-semibold mb-2">How to test:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Connect your wallet using the button in the navigation</li>
          <li>Make sure you&apos;re on Sepolia network</li>
          <li>Get Sepolia ETH from a faucet (e.g., https://sepoliafaucet.com)</li>
          <li>
            <strong>TokenFactory:</strong> Use &quot;Read Token Address&quot; to query deployed tokens (start with index
            0)
          </li>
          <li>
            <strong>TokenFactory:</strong> If you have admin role, create a new ERC20 token
          </li>
          <li>
            <strong>Token Balance:</strong> Copy a token address and check your balance
          </li>
          <li>
            <strong>Allowance:</strong> Approve a spender address to use your tokens
          </li>
          <li>Check all transactions on Etherscan using the provided links</li>
        </ol>
      </div>
    </div>
  );
};
