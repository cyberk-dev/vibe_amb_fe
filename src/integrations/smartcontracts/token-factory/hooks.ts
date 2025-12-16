import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import type { Address, TransactionReceipt } from "viem";
import { parseUnits } from "viem";
import { tokenFactoryAbi } from "./abi";
import { TOKEN_FACTORY_ADDRESS, CHAIN_ID } from "../config";
import { useEffect } from "react";

type TxError = Error & {
  cause?: { reason?: string };
  details?: string;
  shortMessage?: string;
};

// Read hooks
export const useTokenAtIndex = (index: number) => {
  return useReadContract({
    abi: tokenFactoryAbi,
    address: TOKEN_FACTORY_ADDRESS,
    functionName: "tokens",
    args: [BigInt(index)],
    chainId: CHAIN_ID,
    query: {
      enabled: index >= 0,
    },
  });
};

export const useDefaultAdmin = () => {
  return useReadContract({
    abi: tokenFactoryAbi,
    address: TOKEN_FACTORY_ADDRESS,
    functionName: "defaultAdmin",
    chainId: CHAIN_ID,
  });
};

export const useIsAdmin = (address: Address | undefined) => {
  return useReadContract({
    abi: tokenFactoryAbi,
    address: TOKEN_FACTORY_ADDRESS,
    functionName: "hasRole",
    args: [
      "0x0000000000000000000000000000000000000000000000000000000000000000", // DEFAULT_ADMIN_ROLE
      address || "0x0000000000000000000000000000000000000000000000000000000000000000",
    ],
    chainId: CHAIN_ID,
    query: {
      enabled: !!address,
    },
  });
};

// Write hooks
export const useCreateToken = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (transactionReceipt: TransactionReceipt) => void;
  onError?: (error: TxError) => void;
}) => {
  const {
    writeContractAsync,
    data: hash,
    isPending: isWritingPending,
    isError: isWriteError,
    failureReason: writeFailureReason,
  } = useWriteContract();

  const {
    data: transactionReceipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError,
    failureReason: receiptFailureReason,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const handleCreateToken = async (name: string, symbol: string, supply: string) => {
    try {
      const supplyInWei = parseUnits(supply, 18);

      return writeContractAsync({
        address: TOKEN_FACTORY_ADDRESS,
        abi: tokenFactoryAbi,
        functionName: "createToken",
        args: [name, symbol, supplyInWei],
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isConfirmed && transactionReceipt) {
      onSuccess?.(transactionReceipt);
    }
    if (isWriteError) {
      onError?.(writeFailureReason as TxError);
    }
    if (isError) {
      onError?.(receiptFailureReason as TxError);
    }
  }, [isConfirmed, isWriteError, isError]);

  return {
    handleCreateToken,
    isConfirming,
    isConfirmed,
    isWritingPending,
    hash,
  };
};
