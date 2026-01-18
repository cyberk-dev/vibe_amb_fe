import { getAptosClient } from "../client";
import { toast } from "sonner";
import { parseContractError, isUserRejection } from "./error-parser";

export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: string;
}

export async function waitForTransaction(hash: string): Promise<boolean> {
  const aptos = getAptosClient();
  const result = await aptos.waitForTransaction({ transactionHash: hash });
  return result.success;
}

export function handleTransactionError(error: unknown): TransactionResult {
  console.error("[Transaction Error]", error);

  if (isUserRejection(error)) {
    toast.error("Transaction cancelled");
    return { success: false, error: "User cancelled" };
  }

  const message = parseContractError(error);
  toast.error(message);
  return { success: false, error: message };
}

export function showTransactionPending(message: string = "Processing transaction...") {
  toast.info(message, { description: "Please wait for confirmation" });
}

export function showTransactionSuccess(message: string = "Transaction successful!") {
  toast.success(message);
}
