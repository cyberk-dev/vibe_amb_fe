import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTodo } from "@/integrations/api/services/todo";
import type { UpdateTodoInput, TodoListResponse } from "@/lib/types/todo.types";
import { toast } from "sonner";

export const useUpdateTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoInput }) => updateTodo(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      // Snapshot previous value
      const previousTodos = queryClient.getQueriesData<TodoListResponse>({ queryKey: ["todos"] });

      // Optimistically update all todo queries
      queryClient.setQueriesData<TodoListResponse>({ queryKey: ["todos"] }, (old) => {
        if (!old) return old;

        return {
          ...old,
          data: old.data.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  ...data,
                  updatedAt: new Date().toISOString(),
                }
              : todo,
          ),
        };
      });

      return { previousTodos };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Todo updated successfully");
    },
    onError: (error: Error, _variables, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        context.previousTodos.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(`Failed to update todo: ${error.message}`);
    },
  });
};
