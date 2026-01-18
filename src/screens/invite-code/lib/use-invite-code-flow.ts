import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { whitelistQueries } from "@/entities/whitelist";
import { useRegisterWhitelist } from "@/features/register-whitelist";
import { useSetDisplayName } from "@/features/set-display-name";

export type FlowState = "not_connected" | "loading" | "registering" | "ready" | "saving" | "failed";

const POPUP_WARNING_STORAGE_KEY = "popup-warning-acknowledged";

export function useInviteCodeFlow() {
  const { connected, account, connect, wallets, isLoading: walletLoading } = useWallet();
  const [displayName, setDisplayName] = useState("");
  const [showPopupWarning, setShowPopupWarning] = useState(false);

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

  // Check if popup warning was acknowledged
  const isPopupWarningAcknowledged = useCallback(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(POPUP_WARNING_STORAGE_KEY) === "true";
  }, []);

  // Actual wallet connection logic
  const performConnect = useCallback(() => {
    const wallet =
      wallets?.find((w) => w.name.includes("Google") || w.name.includes("Connect")) ||
      wallets?.find((w) => w.name === "Petra") ||
      wallets?.[0];
    if (wallet) connect(wallet.name);
  }, [wallets, connect]);

  // Connect handler - shows warning if needed
  const handleConnect = useCallback(() => {
    if (!isPopupWarningAcknowledged()) {
      setShowPopupWarning(true);
      return;
    }
    performConnect();
  }, [isPopupWarningAcknowledged, performConnect]);

  // Proceed after popup warning acknowledged
  const proceedWithConnect = useCallback(() => {
    setShowPopupWarning(false);
    performConnect();
  }, [performConnect]);

  // Close popup warning dialog
  const closePopupWarning = useCallback(() => {
    setShowPopupWarning(false);
  }, []);

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
    // Popup warning state
    showPopupWarning,
    closePopupWarning,
    proceedWithConnect,
  };
}
