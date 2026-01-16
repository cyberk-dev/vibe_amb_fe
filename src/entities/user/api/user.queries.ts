import { queryOptions } from "@tanstack/react-query";
import { userApi } from "./user-api";

export const userQueries = {
  all: () => ["users"],
  list: () =>
    queryOptions({
      queryKey: userQueries.all(),
      queryFn: () => userApi.getAll(),
      staleTime: 5 * 60 * 1000,
    }),
};
