import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo } from "@/integrations/api/services/todo";
import type { TodoListResponse } from "@/lib/types/todo.types";
import { toast } from "sonner";

export const useDeleteTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTodo(id),
    onMutate: async (id: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      // Snapshot previous value
      const previousTodos = queryClient.getQueriesData<TodoListResponse>({ queryKey: ["todos"] });

      // Optimistically update all todo queries
      queryClient.setQueriesData<TodoListResponse>({ queryKey: ["todos"] }, (old) => {
        if (!old) return old;

        return {
          ...old,
          data: old.data.filter((todo) => todo.id !== id),
          pagination: {
            ...old.pagination,
            total: Math.max(0, old.pagination.total - 1),
          },
        };
      });

      return { previousTodos };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Todo deleted successfully");
    },
    onError: (error: Error, _variables, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        context.previousTodos.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(`Failed to delete todo: ${error.message}`);
    },
  });
};
