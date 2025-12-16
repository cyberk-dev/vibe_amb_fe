"use client";

import { useState } from "react";
import { useTokenAtIndex } from "@/integrations/smartcontracts/token-factory";
import { ReadTokens } from "../_components/read-tokens";

export const ReadTokensContainer = () => {
  const [tokenIndex, setTokenIndex] = useState<number>(0);
  const { data: tokenAddress, isLoading, isError, refetch } = useTokenAtIndex(tokenIndex);

  const handleReadToken = () => {
    refetch();
  };

  return (
    <ReadTokens
      tokenIndex={tokenIndex}
      tokenAddress={tokenAddress}
      isLoading={isLoading}
      isError={isError}
      onTokenIndexChange={setTokenIndex}
      onReadToken={handleReadToken}
    />
  );
};
