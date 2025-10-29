"use client";

import { Button } from "./ui/button";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitState,
} from "@reown/appkit/react";
import Image from "next/image";
import WalletIcon from "@/assets/icons/wallet.svg";
import { truncateWalletAddress } from "@/lib/helpers/string";
import { ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  isFullWidth?: boolean;
};

export const ConnectWalletButton: React.FC<Props> = ({ isFullWidth }) => {
  const { open } = useAppKit();
  const { initialized, loading: appKitLoading } = useAppKitState();
  const { address, isConnected } = useAppKitAccount();

  if (appKitLoading)
    return (
      <Button
        type="button"
        variant="ghost"
        className={cn(
          "bg-transparent flex border border-dark700 cursor-pointer",
          isFullWidth ? "flex w-full" : "w-[148px]",
        )}
      >
        <Loader2 className="animate-spin" size={16} />
      </Button>
    );

  if (initialized && isConnected && address)
    return (
      <Button
        type="button"
        variant="ghost"
        className="bg-transparent flex border border-dark700 cursor-pointer"
        onClick={() => open()}
      >
        <p className="text-sm text-grey200">{truncateWalletAddress(address)}</p>
        <ChevronDown size={16} color={"var(--color-grey200)"} />
      </Button>
    );

  return (
    <Button
      className={cn(
        "flex p-2 justify-between items-center text-[#070808] bg-limeGreen cursor-pointer",
        isFullWidth ? "flex w-full" : "w-[148px]",
      )}
      onClick={() => open()}
    >
      {!isFullWidth && (
        <Image height={20} width={20} src={WalletIcon.src} alt="wallet-icon" />
      )}
      <p className="font-bold text-sm w-full">Connect wallet</p>
    </Button>
  );
};
