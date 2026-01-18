export interface VaultBalance {
  asset: string;
  balance: bigint;
}

export interface ClaimableBalance {
  userAddress: string;
  asset: string;
  amount: bigint;
}
