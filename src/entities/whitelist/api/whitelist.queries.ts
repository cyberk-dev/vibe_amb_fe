import { queryOptions } from "@tanstack/react-query";
import { whitelistViewService } from "./whitelist-views";

export const whitelistQueries = {
  all: () => ["whitelist"] as const,

  registration: (address: string) =>
    queryOptions({
      queryKey: [...whitelistQueries.all(), "registration", address],
      queryFn: () => {
        if (!address) throw new Error("Address required");
        return whitelistViewService.isRegistered(address);
      },
      enabled: !!address,
    }),

  inviteCode: (address: string) =>
    queryOptions({
      queryKey: [...whitelistQueries.all(), "inviteCode", address],
      queryFn: () => {
        if (!address) throw new Error("Address required");
        return whitelistViewService.getInviteCode(address);
      },
      enabled: !!address,
      staleTime: 1000,
    }),

  registeredCount: () =>
    queryOptions({
      queryKey: [...whitelistQueries.all(), "registeredCount"],
      queryFn: () => whitelistViewService.getRegisteredCount(),
    }),
};
