export enum TodoStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export interface Todo {
  id: string; // bigint serialized as string
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  profileId: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  status?: TodoStatus;
}

export interface TodoQueryParams {
  page?: number;
  pageSize?: number;
  sort?: string; // e.g., "title:asc", "createdAt:desc"
  search?: string;
  status?: TodoStatus | "all";
}

export interface TodoPagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface TodoListResponse {
  data: Todo[];
  pagination: TodoPagination;
}
