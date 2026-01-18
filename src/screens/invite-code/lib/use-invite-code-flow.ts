import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { whitelistQueries } from "@/entities/whitelist";
import { useSetPlayerRegistration } from "@/entities/player";
import { useRegisterWhitelist } from "@/features/register-whitelist";

export type FlowState = "not_connected" | "connecting" | "checking_registration" | "registering" | "ready";

export function useInviteCodeFlow() {
  const router = useRouter();
  const { connected, account, connect, wallets } = useWallet();
  const [displayName, setDisplayName] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const address = account?.address?.toString();
  const setRegistration = useSetPlayerRegistration();

  // Queries
  const {
    data: isRegistered,
    isLoading: checkingReg,
    refetch: refetchReg,
  } = useQuery({
    ...whitelistQueries.registration(address ?? ""),
    enabled: !!address,
  });

  const { data: inviteCode, refetch: refetchCode } = useQuery({
    ...whitelistQueries.inviteCode(address ?? ""),
    enabled: !!address && isRegistered === true,
  });

  // Mutations
  const { mutateAsync: register, isPending: isRegistering } = useRegisterWhitelist();

  // Reset connecting state when connected
  useEffect(() => {
    if (connected) {
      setIsConnecting(false);
    }
  }, [connected]);

  // Auto-register when connected but not registered
  useEffect(() => {
    if (connected && address && isRegistered === false && !isRegistering) {
      register().then(() => {
        refetchReg();
        refetchCode();
      });
    }
  }, [connected, address, isRegistered, isRegistering, register, refetchReg, refetchCode]);

  // Determine current state
  const getFlowState = (): FlowState => {
    if (!connected) return isConnecting ? "connecting" : "not_connected";
    if (checkingReg) return "checking_registration";
    if (isRegistering) return "registering";
    if (inviteCode) return "ready";
    return "checking_registration";
  };

  const flowState = getFlowState();

  // Handlers
  const handleConnect = useCallback(() => {
    // Find Aptos Connect (Google) or fallback to first available
    const aptosConnect = wallets?.find((w) => w.name.includes("Google") || w.name.includes("Connect"));
    const petraWallet = wallets?.find((w) => w.name === "Petra");
    const wallet = aptosConnect || petraWallet || wallets?.[0];
    if (wallet) {
      setIsConnecting(true);
      connect(wallet.name);
    }
  }, [wallets, connect]);

  const handleContinue = useCallback(() => {
    if (!inviteCode || !displayName.trim() || displayName.trim().length < 2) return;
    if (!address) return;

    setRegistration({
      inviteCode,
      displayName: displayName.trim(),
      walletAddress: address,
    });

    router.push("/landing");
  }, [inviteCode, displayName, address, setRegistration, router]);

  return {
    flowState,
    inviteCode: inviteCode ?? "",
    displayName,
    setDisplayName,
    handleConnect,
    handleContinue,
    isCodeReady: !!inviteCode,
    canContinue: !!inviteCode && displayName.trim().length >= 2,
  };
}
