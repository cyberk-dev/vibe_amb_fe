import { sepolia } from "@reown/appkit/networks";
import { useReadContract } from "wagmi";
import type { Address } from "viem";
import { erc20Abi } from "viem";

export const useTokenBalance = ({
  tokenAddress,
  walletAddress,
}: {
  tokenAddress: Address | undefined;
  walletAddress: Address | undefined;
}) => {
  return useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: walletAddress ? [walletAddress] : undefined,
    chainId: sepolia.id,
    query: {
      enabled: !!tokenAddress && !!walletAddress,
    },
  });
};

export const useTokenInfo = (tokenAddress: Address | undefined) => {
  const { data: name } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "name",
    chainId: sepolia.id,
    query: {
      enabled: !!tokenAddress,
    },
  });

  const { data: symbol } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "symbol",
    chainId: sepolia.id,
    query: {
      enabled: !!tokenAddress,
    },
  });

  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "decimals",
    chainId: sepolia.id,
    query: {
      enabled: !!tokenAddress,
    },
  });

  const { data: totalSupply } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "totalSupply",
    chainId: sepolia.id,
    query: {
      enabled: !!tokenAddress,
    },
  });

  return {
    name,
    symbol,
    decimals: decimals ?? 18,
    totalSupply,
  };
};
