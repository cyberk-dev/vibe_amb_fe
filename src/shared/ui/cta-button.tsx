"use client";

import { type VariantProps } from "class-variance-authority";
import * as React from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";

import { Button, buttonVariants } from "@/shared/ui/button";
import { ConnectWalletButton } from "@/features/wallet";

export interface CtaButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  sending?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  smartContractChainId?: number;
}

const CtaButton = React.forwardRef<HTMLButtonElement, CtaButtonProps>(
  ({ children, sending, loading, smartContractChainId, onClick, ...props }, forwardedRef) => {
    const { isConnected } = useAccount();
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (smartContractChainId && smartContractChainId !== chainId) {
        switchChain({ chainId: smartContractChainId });
      } else if (onClick) {
        onClick(e);
      }
    };

    const buttonContent = smartContractChainId && smartContractChainId !== chainId ? "Switch Network" : children;

    if (!isConnected) return <ConnectWalletButton isFullWidth />;

    return (
      <Button ref={forwardedRef} disabled={sending || loading} onClick={handleClick} {...props}>
        {sending ? (
          <div className="flex gap-2">
            <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 bg-current rounded-full animate-bounce"></div>
          </div>
        ) : (
          <>
            {loading ? (
              <div className="flex gap-2 items-center">
                {children}
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full animate-pulse [animation-delay:-0.3s] bg-current"></div>
                  <div className="w-1 h-1 rounded-full animate-pulse [animation-delay:-0.15s] bg-current"></div>
                  <div className="w-1 h-1 rounded-full animate-pulse bg-current"></div>
                </div>
              </div>
            ) : (
              buttonContent
            )}
          </>
        )}
      </Button>
    );
  },
);

CtaButton.displayName = "CtaButton";
export { CtaButton };
