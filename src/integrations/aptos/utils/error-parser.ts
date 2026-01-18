// Error codes from docs/contract-integration.md Section 6

const GAME_ERRORS: Record<number, string> = {
  2001: "Cannot join - game has already started",
  2002: "You have already joined this game",
  2003: "Need at least 5 players to start",
  2005: "You have already made your choice this round",
  2007: "Cannot choose - not in selection phase",
  2008: "Player is not active in this game",
  2009: "Cannot reveal - not in revealing phase",
  2010: "Cannot vote - not in voting phase",
  2011: "You have already cast your vote",
  2012: "Only admin can perform this action",
  2013: "Vault does not have enough funds",
  2014: "Payment asset not configured",
  2015: "Cannot change settings - game already started",
  2016: "Invalid payment asset",
  2017: "Target player is not active in this game",
};

const VAULT_ERRORS: Record<number, string> = {
  1001: "No prizes available to claim",
  1002: "Claim amount is zero",
  1003: "Only admin can perform this action",
  1004: "This asset is not accepted for payment",
};

export function parseContractError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  // Try to extract error code
  const codeMatch = message.match(/Move abort.*?(\d{4})/);
  if (codeMatch) {
    const code = parseInt(codeMatch[1], 10);

    if (code >= 2000 && code < 3000) {
      return GAME_ERRORS[code] || `Game error: ${code}`;
    }
    if (code >= 1000 && code < 2000) {
      return VAULT_ERRORS[code] || `Vault error: ${code}`;
    }
  }

  // User rejection
  if (message.includes("rejected") || message.includes("cancelled") || message.includes("denied")) {
    return "Transaction cancelled by user";
  }

  return "Transaction failed. Please try again.";
}

export function isUserRejection(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("rejected") || message.includes("cancelled") || message.includes("denied");
}
