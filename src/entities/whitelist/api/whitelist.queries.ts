import { queryOptions } from "@tanstack/react-query";
import { whitelistViewService } from "./whitelist-views";

export const whitelistQueries = {
  all: () => ["whitelist"] as const,

  registration: (address: string) =>
    queryOptions({
      queryKey: [...whitelistQueries.all(), "registration", address],
      queryFn: () => whitelistViewService.isRegistered(address),
      enabled: !!address,
      staleTime: 30_000,
    }),

  inviteCode: (address: string) =>
    queryOptions({
      queryKey: [...whitelistQueries.all(), "inviteCode", address],
      queryFn: () => whitelistViewService.getInviteCode(address),
      enabled: !!address,
      staleTime: Infinity, // Code doesn't change once generated
    }),

  registeredCount: () =>
    queryOptions({
      queryKey: [...whitelistQueries.all(), "registeredCount"],
      queryFn: () => whitelistViewService.getRegisteredCount(),
      staleTime: 60_000,
    }),
};
