import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoApi, todoQueries, type UpdateTodoInput, type TodoListResponse } from "@/entities/todo";
import { toast } from "sonner";

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoInput }) => todoApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: todoQueries.all() });
      const previousTodos = queryClient.getQueriesData<TodoListResponse>({
        queryKey: todoQueries.all(),
      });

      queryClient.setQueriesData<TodoListResponse>({ queryKey: todoQueries.all() }, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((todo) =>
            todo.id === id ? { ...todo, ...data, updatedAt: new Date().toISOString() } : todo,
          ),
        };
      });

      return { previousTodos };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoQueries.lists() });
      toast.success("Todo updated successfully");
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousTodos) {
        context.previousTodos.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(`Failed to update todo: ${error.message}`);
    },
  });
};
