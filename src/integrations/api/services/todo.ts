import apiClient from "@/integrations/api/core/client";
import type { Todo, CreateTodoInput, UpdateTodoInput, TodoQueryParams, TodoListResponse } from "@/entities/todo";

// Transform client query params to backend format
function buildQueryString(params: TodoQueryParams): string {
  const queryParts: string[] = [];

  // Handle pagination
  if (params.page !== undefined && params.pageSize !== undefined) {
    const skip = (params.page - 1) * params.pageSize;
    queryParts.push(`skip=${skip}`);
    queryParts.push(`take=${params.pageSize}`);
  }

  // Handle search filter (title contains)
  if (params.search) {
    queryParts.push(`where[title][contains]=${encodeURIComponent(params.search)}`);
  }

  // Handle status filter
  if (params.status && params.status !== "all") {
    queryParts.push(`where[status]=${params.status}`);
  }

  // Handle sorting
  if (params.sort) {
    const [field, direction] = params.sort.split(":");
    if (field && direction) {
      queryParts.push(`sort[${field}]=${direction}`);
    }
  }

  return queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
}

export async function getTodos(params: TodoQueryParams): Promise<TodoListResponse> {
  const queryString = buildQueryString(params);
  const response = await apiClient.get<TodoListResponse>(`/todo${queryString}`);
  return response.data;
}

export async function getTodo(id: string): Promise<Todo> {
  const response = await apiClient.get<Todo>(`/todo/${id}`);
  return response.data;
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const response = await apiClient.post<Todo>("/todo", input);
  return response.data;
}

export async function updateTodo(id: string, input: UpdateTodoInput): Promise<Todo> {
  const response = await apiClient.put<Todo>(`/todo/${id}`, input);
  return response.data;
}

export async function deleteTodo(id: string): Promise<void> {
  await apiClient.delete(`/todo/${id}`);
}
