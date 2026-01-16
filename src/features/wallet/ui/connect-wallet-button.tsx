"use client";

import { Button } from "@/shared/ui/button";
import { useAppKit, useAppKitAccount, useAppKitState } from "@reown/appkit/react";
import { truncateWalletAddress } from "@/shared/lib/string";
import { ChevronDown, Loader2, Wallet2Icon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type Props = {
  isFullWidth?: boolean;
  className?: string;
};

export const ConnectWalletButton: React.FC<Props> = ({ isFullWidth, className }) => {
  const { open } = useAppKit();
  const { initialized, loading: appKitLoading } = useAppKitState();
  const { address, isConnected } = useAppKitAccount();

  if (appKitLoading)
    return (
      <Button
        type="button"
        variant="outline"
        className={cn("flex cursor-pointer", isFullWidth ? "flex w-full" : "w-[148px]", className)}
      >
        <Loader2 className="animate-spin" size={16} />
      </Button>
    );

  if (initialized && isConnected && address)
    return (
      <Button type="button" variant="outline" className={cn("flex cursor-pointer", className)} onClick={() => open()}>
        <p className="text-sm">{truncateWalletAddress(address)}</p>
        <ChevronDown size={16} />
      </Button>
    );

  return (
    <Button
      className={cn(
        "flex p-2 justify-between items-center cursor-pointer",
        isFullWidth ? "flex w-full" : "w-[148px]",
        className,
      )}
      onClick={() => open()}
    >
      {!isFullWidth && <Wallet2Icon size={20} />}
      <p className="font-bold text-sm w-full">Connect wallet</p>
    </Button>
  );
};
