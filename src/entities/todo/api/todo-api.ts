import apiClient from "@/shared/api/client";
import type { Todo, CreateTodoInput, UpdateTodoInput, TodoQueryParams, TodoListResponse } from "../model/types";

function buildQueryString(params: TodoQueryParams): string {
  const queryParts: string[] = [];
  if (params.page !== undefined && params.pageSize !== undefined) {
    const skip = (params.page - 1) * params.pageSize;
    queryParts.push(`skip=${skip}`);
    queryParts.push(`take=${params.pageSize}`);
  }
  if (params.search) {
    queryParts.push(`where[title][contains]=${encodeURIComponent(params.search)}`);
  }
  if (params.status && params.status !== "all") {
    queryParts.push(`where[status]=${params.status}`);
  }
  if (params.sort) {
    const [field, direction] = params.sort.split(":");
    if (field && direction) {
      queryParts.push(`sort[${field}]=${direction}`);
    }
  }
  return queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
}

export const todoApi = {
  getAll: async (params: TodoQueryParams): Promise<TodoListResponse> => {
    const queryString = buildQueryString(params);
    const response = await apiClient.get<TodoListResponse>(`/todo${queryString}`);
    return response.data;
  },
  getById: async (id: string): Promise<Todo> => {
    const response = await apiClient.get<Todo>(`/todo/${id}`);
    return response.data;
  },
  create: async (input: CreateTodoInput): Promise<Todo> => {
    const response = await apiClient.post<Todo>("/todo", input);
    return response.data;
  },
  update: async (id: string, input: UpdateTodoInput): Promise<Todo> => {
    const response = await apiClient.put<Todo>(`/todo/${id}`, input);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/todo/${id}`);
  },
};
