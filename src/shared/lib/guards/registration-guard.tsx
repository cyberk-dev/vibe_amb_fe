"use client";

import { useEffect, useState, type PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { usePlayerRegistration } from "@/entities/player";

/**
 * RegistrationGuard - Protects routes that require valid player registration
 *
 * Redirects to /invite-code if:
 * - Wallet not connected
 * - No registration data in store
 * - Registration wallet doesn't match current wallet
 *
 * Shows loading state while checking registration.
 */
export function RegistrationGuard({ children }: PropsWithChildren) {
  const router = useRouter();
  const { connected, account } = useWallet();
  const registration = usePlayerRegistration();
  const [isChecking, setIsChecking] = useState(true);

  const hasValidRegistration = Boolean(
    registration?.inviteCode &&
      registration?.displayName &&
      registration.walletAddress === account?.address?.toString(),
  );

  useEffect(() => {
    // Wait for wallet connection state to stabilize
    if (!connected) {
      // Still checking - wallet might be auto-connecting
      const timeout = setTimeout(() => {
        if (!connected) {
          router.replace("/invite-code");
        }
      }, 1000); // Give 1s for auto-connect
      return () => clearTimeout(timeout);
    }

    // Wallet connected, check registration
    if (!hasValidRegistration) {
      router.replace("/invite-code");
      return;
    }

    setIsChecking(false);
  }, [connected, hasValidRegistration, router]);

  // Show loading while checking
  if (isChecking || !connected || !hasValidRegistration) {
    return (
      <div className="h-full flex items-center justify-center bg-[#fff7ed]">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-[#f54900] text-lg font-space">Checking registration...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
