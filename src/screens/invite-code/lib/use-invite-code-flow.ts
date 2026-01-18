import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { whitelistQueries } from "@/entities/whitelist";
import { gameQueries } from "@/entities/game";
import { useRegisterWhitelist } from "@/features/register-whitelist";
import { useSetDisplayName } from "@/features/set-display-name";

export type FlowState =
  | "not_connected" // Step 0: Need to connect wallet
  | "loading" // Loading state
  | "need_code" // Step 1: Connected, needs to claim code
  | "claiming" // Claiming code (register mutation pending)
  | "need_name" // Step 2: Has code, needs name
  | "saving" // Step 3: Saving name on-chain
  | "failed"; // Error state

const POPUP_WARNING_STORAGE_KEY = "popup-warning-acknowledged";

export function useInviteCodeFlow() {
  const router = useRouter();
  const { connected, account, connect, wallets, isLoading: walletLoading } = useWallet();
  const [displayName, setDisplayName] = useState("");
  const [showPopupWarning, setShowPopupWarning] = useState(false);

  const address = account?.address?.toString();

  // Check if already joined (redirect to waiting-room)
  const { data: hasJoined } = useQuery({
    ...gameQueries.hasJoined(address ?? ""),
    enabled: !!address && connected,
    retry: false,
  });

  // Check if has pending name (redirect to landing)
  const { data: hasPendingName } = useQuery({
    ...gameQueries.hasPendingName(address ?? ""),
    enabled: !!address && connected,
    retry: false,
  });

  // Redirect if user is already past this screen
  useEffect(() => {
    if (hasJoined === true) {
      router.replace("/waiting-room");
    } else if (hasPendingName === true) {
      router.replace("/landing");
    }
  }, [hasJoined, hasPendingName, router]);

  // Single query: get_invite_code (error = not registered)
  const { data: inviteCode, isLoading: codeLoading } = useQuery({
    ...whitelistQueries.inviteCode(address ?? ""),
    enabled: !!address && connected,
    retry: false,
  });

  // Mutation - onSuccess invalidates whitelistQueries.all()
  const { mutate: register, isPending: isRegistering, error: registerError } = useRegisterWhitelist();

  // SetDisplayName mutation
  const { mutateAsync: saveDisplayName, isPending: isSaving } = useSetDisplayName();

  // State machine
  const flowState: FlowState = (() => {
    if (!connected) return walletLoading ? "loading" : "not_connected";
    if (codeLoading) return "loading";
    if (registerError) return "failed";
    if (isRegistering) return "claiming";

    // Has code → check name
    if (inviteCode) {
      if (isSaving) return "saving";
      return "need_name"; // Always need_name until they click Continue
    }

    // No code → need to claim
    return "need_code";
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

  // Claim code handler - explicit button click
  const handleClaimCode = useCallback(() => {
    if (connected && !inviteCode && !isRegistering) {
      register();
    }
  }, [connected, inviteCode, isRegistering, register]);

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
    handleClaimCode,
    handleContinue,
    canContinue: !!inviteCode && displayName.trim().length >= 2 && !isSaving,
    // Popup warning state
    showPopupWarning,
    closePopupWarning,
    proceedWithConnect,
  };
}
