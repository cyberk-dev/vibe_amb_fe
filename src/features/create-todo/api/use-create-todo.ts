import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  todoApi,
  todoQueries,
  type Todo,
  type CreateTodoInput,
  type TodoListResponse,
  TodoStatus,
} from "@/entities/todo";
import { toast } from "sonner";

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTodoInput) => todoApi.create(input),
    onMutate: async (input: CreateTodoInput) => {
      await queryClient.cancelQueries({ queryKey: todoQueries.all() });
      const previousTodos = queryClient.getQueriesData<TodoListResponse>({
        queryKey: todoQueries.all(),
      });

      queryClient.setQueriesData<TodoListResponse>({ queryKey: todoQueries.all() }, (old) => {
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
          pagination: { ...old.pagination, total: old.pagination.total + 1 },
        };
      });

      return { previousTodos };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoQueries.lists() });
      toast.success("Todo created successfully");
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousTodos) {
        context.previousTodos.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(`Failed to create todo: ${error.message}`);
    },
  });
};
