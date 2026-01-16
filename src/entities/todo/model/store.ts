import { create } from "zustand";
import type { Todo } from "./types";

interface TodoStore {
  selectedTodo: Todo | null;
  setSelectedTodo: (todo: Todo | null) => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  selectedTodo: null,
  setSelectedTodo: (todo) => set({ selectedTodo: todo }),
}));
