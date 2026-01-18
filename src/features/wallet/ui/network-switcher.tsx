"use client";

// COMMENTED: EVM network switcher - app now uses Aptos
// import { Button } from "@/shared/ui/button";
// import { useAppKit, useAppKitNetwork } from "@reown/appkit/react";
// import { ChevronDown } from "lucide-react";

type Props = {
  className?: string;
};

// COMMENTED: EVM NetworkSwitcher - restore when EVM provider is enabled
// export const NetworkSwitcher: React.FC<Props> = ({ className }) => {
//   const { open } = useAppKit();
//   const { caipNetwork } = useAppKitNetwork();
//
//   const handleOpenNetworkModal = () => {
//     open({ view: "Networks" });
//   };
//
//   return (
//     <Button type="button" variant="outline" className={className} onClick={handleOpenNetworkModal}>
//       <span className="text-sm">{caipNetwork?.name || "Select Network"}</span>
//       <ChevronDown size={16} />
//     </Button>
//   );
// };

// Placeholder component while EVM is disabled
export const NetworkSwitcher: React.FC<Props> = () => {
  // EVM network switcher disabled - Aptos is used
  return null;
};
