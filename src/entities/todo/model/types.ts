import type { ApiTypes } from "@/shared/api";

// Re-export swagger types
export type Todo = ApiTypes.TodoEntity;
export type CreateTodoInput = ApiTypes.CreateTodoDto;
export type UpdateTodoInput = ApiTypes.UpdateTodoDto;
export type TodoPagination = ApiTypes.BasePaginationEntity;

// Derive TodoStatus from swagger type
export type TodoStatus = NonNullable<ApiTypes.UpdateTodoDto["status"]>;
export const TodoStatus = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
} as const;

// Frontend-only types
export interface TodoQueryParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  search?: string;
  status?: TodoStatus | "all";
}

export interface TodoListResponse {
  data: Todo[];
  pagination: TodoPagination;
}
