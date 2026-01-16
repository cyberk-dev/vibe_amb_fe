import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo } from "@/integrations/api/services/todo";
import { type CreateTodoInput, type TodoListResponse, type Todo, TodoStatus } from "@/entities/todo";
import { toast } from "sonner";

export const useCreateTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTodoInput) => createTodo(input),
    onMutate: async (input: CreateTodoInput) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      // Snapshot previous value
      const previousTodos = queryClient.getQueriesData<TodoListResponse>({ queryKey: ["todos"] });

      // Optimistically update all todo queries
      queryClient.setQueriesData<TodoListResponse>({ queryKey: ["todos"] }, (old) => {
        if (!old) return old;

        const optimisticTodo: Todo = {
          id: `temp-${Date.now()}`,
          title: input.title,
          description: input.description || "",
          status: TodoStatus.TODO,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          profileId: "temp",
          profile: null as any,
        };

        return {
          ...old,
          data: [optimisticTodo, ...old.data],
          pagination: {
            ...old.pagination,
            total: old.pagination.total + 1,
          },
        };
      });

      return { previousTodos };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Todo created successfully");
    },
    onError: (error: Error, _variables, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        context.previousTodos.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(`Failed to create todo: ${error.message}`);
    },
  });
};
