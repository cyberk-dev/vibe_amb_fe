"use client";

import { Button } from "./ui/button";
import { useAppKit, useAppKitNetwork } from "@reown/appkit/react";
import { ChevronDown } from "lucide-react";

type Props = {
  className?: string;
};

export const NetworkSwitcher: React.FC<Props> = ({ className }) => {
  const { open } = useAppKit();
  const { caipNetwork } = useAppKitNetwork();

  const handleOpenNetworkModal = () => {
    open({ view: "Networks" });
  };

  return (
    <Button type="button" variant="outline" className={className} onClick={handleOpenNetworkModal}>
      <span className="text-sm">{caipNetwork?.name || "Select Network"}</span>
      <ChevronDown size={16} />
    </Button>
  );
};
