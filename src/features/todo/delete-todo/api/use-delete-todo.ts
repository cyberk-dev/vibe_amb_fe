import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoApi, todoQueries, type TodoListResponse } from "@/entities/todo";
import { toast } from "sonner";

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => todoApi.delete(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: todoQueries.all() });
      const previousTodos = queryClient.getQueriesData<TodoListResponse>({
        queryKey: todoQueries.all(),
      });

      queryClient.setQueriesData<TodoListResponse>({ queryKey: todoQueries.all() }, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((todo) => todo.id !== id),
          pagination: { ...old.pagination, total: Math.max(0, old.pagination.total - 1) },
        };
      });

      return { previousTodos };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoQueries.lists() });
      toast.success("Todo deleted successfully");
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousTodos) {
        context.previousTodos.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(`Failed to delete todo: ${error.message}`);
    },
  });
};
