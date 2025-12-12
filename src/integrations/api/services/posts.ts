import apiClient from "../core/client";

// Todo interface matching backend structure
export interface Todo {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
  profileId: string;
  profile: {
    id: string;
    displayName?: string;
  };
}

// Legacy Post interface for backward compatibility (will be removed)
export interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Real API functions using backend todo endpoints
export const getTodos = async (): Promise<Todo[]> => {
  const response = await apiClient.get<Todo[]>("/todo");
  return response.data;
};

export const getTodo = async (id: string): Promise<Todo> => {
  const response = await apiClient.get<Todo>(`/todo/${id}`);
  return response.data;
};

export const createTodo = async (data: { title: string; description?: string; done?: boolean }): Promise<Todo> => {
  const response = await apiClient.post<Todo>("/todo", data);
  return response.data;
};

export const updateTodo = async (
  id: string,
  data: {
    title?: string;
    description?: string;
    done?: boolean;
  },
): Promise<Todo> => {
  const response = await apiClient.put<Todo>(`/todo/${id}`, data);
  return response.data;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await apiClient.delete(`/todo/${id}`);
};

// API service functions using real backend
export const postsApi = {
  getPosts: getTodos,
  getPost: getTodo,
  createPost: createTodo,
  updatePost: updateTodo,
  deletePost: deleteTodo,
};

// Export as todosApi for clarity
export const todosApi = {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
};
