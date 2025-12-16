"use client";

import { useAccount } from "wagmi";
import { useDefaultAdmin, useIsAdmin } from "@/integrations/smartcontracts/token-factory";
import { ContractInfo } from "../_components/contract-info";

export const ContractInfoContainer = () => {
  const { address, isConnected, chainId } = useAccount();
  const { data: defaultAdmin } = useDefaultAdmin();
  const { data: isAdmin } = useIsAdmin(address);

  return (
    <ContractInfo
      address={address}
      isConnected={isConnected}
      chainId={chainId}
      defaultAdmin={defaultAdmin}
      isAdmin={isAdmin}
    />
  );
};
