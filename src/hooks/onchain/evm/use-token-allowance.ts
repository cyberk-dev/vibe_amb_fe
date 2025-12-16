import { sepolia } from "@reown/appkit/networks";
import { useEffect } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import type { Address, TransactionReceipt } from "viem";
import { erc20Abi, parseUnits } from "viem";

type TxError = Error & {
  cause?: { reason?: string };
  details?: string;
  shortMessage?: string;
};

// Read current allowance
export const useTokenAllowance = ({
  tokenAddress,
  ownerAddress,
  spenderAddress,
}: {
  tokenAddress: Address | undefined;
  ownerAddress: Address | undefined;
  spenderAddress: Address | undefined;
}) => {
  return useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: ownerAddress && spenderAddress ? [ownerAddress, spenderAddress] : undefined,
    chainId: sepolia.id,
    query: {
      enabled: !!tokenAddress && !!ownerAddress && !!spenderAddress,
    },
  });
};

// Execute approval
export const useApproveTokenAllowance = ({
  tokenAddress,
  onSuccess,
  onError,
}: {
  tokenAddress: Address | undefined;
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

  const approve = async (spenderAddress: Address, amount: string, decimals: number) => {
    if (!tokenAddress) {
      throw new Error("Token address is required");
    }

    try {
      const amountInUnits = parseUnits(amount, decimals);

      return writeContractAsync({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "approve",
        args: [spenderAddress, amountInUnits],
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
    approve,
    isConfirming,
    isConfirmed,
    isWritingPending,
    hash,
  };
};
