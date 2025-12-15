"use client";

import { useState } from "react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TodoTable } from "../_components/todo-table";
import { TodoFilters } from "../_components/todo-filters";
import { TodoFormDialog } from "../_components/todo-form-dialog";
import { TodoPagination } from "../_components/todo-pagination";
import { useTodosQuery } from "@/integrations/api/hooks/todo/use-todos-query";
import { useCreateTodoMutation } from "@/integrations/api/hooks/todo/use-create-todo-mutation";
import { useUpdateTodoMutation } from "@/integrations/api/hooks/todo/use-update-todo-mutation";
import { useDeleteTodoMutation } from "@/integrations/api/hooks/todo/use-delete-todo-mutation";
import type { Todo, TodoStatus } from "@/lib/types/todo.types";
import type { TodoFormValues } from "../_components/todo-form-dialog";
import { Edit, Trash2, Plus } from "lucide-react";

const statusVariants: Record<TodoStatus, "default" | "secondary" | "outline"> = {
  TODO: "default",
  IN_PROGRESS: "secondary",
  DONE: "outline",
};

const statusLabels: Record<TodoStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export function TodoManagementContainer() {
  // URL state management
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [pageSize, setPageSize] = useQueryState("pageSize", parseAsInteger.withDefault(20));
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [status, setStatus] = useQueryState("status", parseAsString.withDefault("all"));
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault("createdAt:desc"));

  // Local state for dialogs
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  // Data fetching
  const { data, isLoading } = useTodosQuery({
    page,
    pageSize,
    search: search || undefined,
    status: status !== "all" ? (status as TodoStatus) : undefined,
    sort,
  });

  // Mutations
  const createMutation = useCreateTodoMutation();
  const updateMutation = useUpdateTodoMutation();
  const deleteMutation = useDeleteTodoMutation();

  // Column definitions
  const columns: ColumnDef<Todo>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
      enableSorting: true,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description") as string | null;
        return <div className="max-w-[300px] truncate text-muted-foreground">{description || "-"}</div>;
      },
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as TodoStatus;
        return <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>;
      },
      enableSorting: true,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return <div className="text-sm">{date.toLocaleDateString()}</div>;
      },
      enableSorting: true,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const todo = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleEdit(todo)} className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteClick(todo)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        );
      },
      enableSorting: false,
    },
  ];

  // Parse sort parameter for TanStack Table
  const [sortBy, sortOrder] = sort.split(":");
  const sorting: SortingState = [
    {
      id: sortBy,
      desc: sortOrder === "desc",
    },
  ];

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: (updaterOrValue: ((old: SortingState) => SortingState) | SortingState) => {
      const newSorting = typeof updaterOrValue === "function" ? updaterOrValue(sorting) : updaterOrValue;
      if (newSorting.length > 0) {
        const newSortBy = newSorting[0].id;
        const newSortOrder = newSorting[0].desc ? "desc" : "asc";
        void setSort(`${newSortBy}:${newSortOrder}`);
      } else {
        // Reset to default sort when clearing
        void setSort("createdAt:desc");
      }
    },
    enableSortingRemoval: false, // Prevent removing sort, always have a sort direction
    manualSorting: true,
    manualPagination: true,
  });

  // Event handlers
  const handleCreate = (data: TodoFormValues) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
      },
    });
  };

  const handleEdit = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: TodoFormValues) => {
    if (!selectedTodo) return;
    updateMutation.mutate(
      { id: selectedTodo.id, data },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setSelectedTodo(null);
        },
      },
    );
  };

  const handleDeleteClick = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedTodo) return;
    deleteMutation.mutate(selectedTodo.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setSelectedTodo(null);
      },
    });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page on search
  };

  const handleStatusChange = (value: "all" | TodoStatus) => {
    setStatus(value);
    setPage(1); // Reset to first page on filter
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Todo Management</h1>
          <p className="text-muted-foreground">Manage your todos with advanced filtering and sorting</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Todo
        </Button>
      </div>

      <TodoFilters
        searchValue={search}
        statusValue={status as "all" | TodoStatus}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
      />

      <TodoTable table={table} onEdit={handleEdit} onDelete={handleDeleteClick} isLoading={isLoading} />

      {data?.pagination && (
        <TodoPagination
          pagination={data.pagination}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      <TodoFormDialog
        mode="create"
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
      />

      <TodoFormDialog
        mode="edit"
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdate}
        initialData={selectedTodo || undefined}
        isSubmitting={updateMutation.isPending}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the todo &quot;{selectedTodo?.title}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
