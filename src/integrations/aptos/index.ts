// Public API
export { aptosClient, getAptosClient, NETWORK } from "./client";
export {
  CONTRACT_ADDRESS,
  GAME_MODULE,
  VAULT_MODULE,
  WHITELIST_MODULE,
  ROUTER_MODULE,
  PAYMENT_ASSET,
  buildFunctionPath,
} from "./config";
export { GameStatus, Vote, type ViewResponse } from "./types";
export { parseContractError, isUserRejection, isAlreadyRegisteredError } from "./utils/error-parser";
export {
  waitForTransaction,
  handleTransactionError,
  showTransactionPending,
  showTransactionSuccess,
  type TransactionResult,
} from "./utils/transaction-helpers";
export { viewProxy } from "./utils/view-proxy";

// Provider
export { AptosProvider } from "./aptos-provider";
