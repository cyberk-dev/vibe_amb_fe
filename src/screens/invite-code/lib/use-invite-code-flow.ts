import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { whitelistQueries } from "@/entities/whitelist";
import { useRegisterWhitelist } from "@/features/register-whitelist";
import { useSetDisplayName } from "@/features/set-display-name";

export type FlowState = "not_connected" | "loading" | "registering" | "ready" | "saving" | "failed";

export function useInviteCodeFlow() {
  const { connected, account, connect, wallets, isLoading: walletLoading } = useWallet();
  const [displayName, setDisplayName] = useState("");

  const address = account?.address?.toString();

  // Single query: get_invite_code (error = not registered)
  const {
    data: inviteCode,
    isLoading: codeLoading,
    isError,
  } = useQuery({
    ...whitelistQueries.inviteCode(address ?? ""),
    enabled: !!address && connected,
    retry: false,
  });

  // Mutation - onSuccess invalidates whitelistQueries.all()
  const { mutate: register, isPending: isRegistering, error: registerError } = useRegisterWhitelist();

  // SetDisplayName mutation
  const { mutateAsync: saveDisplayName, isPending: isSaving } = useSetDisplayName();

  // Auto-register if not registered (query error)
  useEffect(() => {
    if (isError && connected && !isRegistering && !registerError) {
      register();
    }
  }, [isError, connected, isRegistering, registerError, register]);

  // State machine
  const flowState: FlowState = (() => {
    if (!connected) return walletLoading ? "loading" : "not_connected";
    if (codeLoading) return "loading";
    if (registerError) return "failed";
    if (isRegistering || isError) return "registering";
    if (isSaving) return "saving";
    if (inviteCode) return "ready";
    return "loading";
  })();

  // Connect handler
  const handleConnect = useCallback(() => {
    const wallet =
      wallets?.find((w) => w.name.includes("Google") || w.name.includes("Connect")) ||
      wallets?.find((w) => w.name === "Petra") ||
      wallets?.[0];
    if (wallet) connect(wallet.name);
  }, [wallets, connect]);

  // Continue handler - saves name on-chain, guard will navigate
  const handleContinue = useCallback(async () => {
    if (!inviteCode || displayName.trim().length < 2) return;

    try {
      await saveDisplayName({ code: inviteCode, name: displayName.trim() });
      // Guard will detect hasPendingName → navigate to /landing
    } catch {
      // Error handled by mutation
    }
  }, [inviteCode, displayName, saveDisplayName]);

  return {
    flowState,
    inviteCode: inviteCode ?? "",
    displayName,
    setDisplayName,
    handleConnect,
    handleContinue,
    canContinue: !!inviteCode && displayName.trim().length >= 2 && !isSaving,
  };
}
