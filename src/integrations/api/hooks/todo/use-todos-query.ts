import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getTodos } from "@/integrations/api/services/todo";
import type { TodoQueryParams } from "@/lib/types/todo.types";

export const useTodosQuery = (params: TodoQueryParams) => {
  return useQuery({
    queryKey: ["todos", params],
    queryFn: () => getTodos(params),
    staleTime: 30000,
    placeholderData: keepPreviousData,
  });
};
