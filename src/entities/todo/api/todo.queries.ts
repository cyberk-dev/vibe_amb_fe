import { queryOptions, keepPreviousData } from "@tanstack/react-query";
import { todoApi } from "./todo-api";
import type { TodoQueryParams } from "../model/types";

export const todoQueries = {
  all: () => ["todos"] as const,
  lists: () => [...todoQueries.all(), "list"] as const,
  list: (params: TodoQueryParams) =>
    queryOptions({
      queryKey: [...todoQueries.lists(), params],
      queryFn: () => todoApi.getAll(params),
      placeholderData: keepPreviousData,
      staleTime: 30000,
    }),
  details: () => [...todoQueries.all(), "detail"] as const,
  detail: (id: string) =>
    queryOptions({
      queryKey: [...todoQueries.details(), id],
      queryFn: () => todoApi.getById(id),
      staleTime: 5000,
    }),
};
