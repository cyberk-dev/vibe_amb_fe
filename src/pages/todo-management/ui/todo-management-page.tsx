"use client";

import { useState } from "react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { Button } from "@/shared/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";

import { type Todo, TodoStatus, todoQueries, TodoStatusBadge, useTodoStore } from "@/entities/todo";
import { CreateTodoDialog } from "@/features/create-todo";
import { UpdateTodoDialog } from "@/features/update-todo";
import { DeleteTodoDialog } from "@/features/delete-todo";
import { TodoFilters, TodoTable, TodoPagination } from "@/widgets/todo-list";

export default function TodoManagementPage() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [pageSize, setPageSize] = useQueryState("pageSize", parseAsInteger.withDefault(20));
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [status, setStatus] = useQueryState("status", parseAsString.withDefault("all"));
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault("createdAt:desc"));

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { selectedTodo, setSelectedTodo } = useTodoStore();

  const { data, isLoading } = useQuery(
    todoQueries.list({
      page,
      pageSize,
      search: search || undefined,
      status: status !== "all" ? (status as TodoStatus) : undefined,
      sort,
    }),
  );

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
      cell: ({ row }) => <TodoStatusBadge status={row.getValue("status")} />,
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

  const [sortBy, sortOrder] = sort.split(":");
  const sorting: SortingState = [{ id: sortBy, desc: sortOrder === "desc" }];

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: (updaterOrValue) => {
      const newSorting = typeof updaterOrValue === "function" ? updaterOrValue(sorting) : updaterOrValue;
      if (newSorting.length > 0) {
        void setSort(`${newSorting[0].id}:${newSorting[0].desc ? "desc" : "asc"}`);
      } else {
        void setSort("createdAt:desc");
      }
    },
    enableSortingRemoval: false,
    manualSorting: true,
    manualPagination: true,
  });

  const handleEdit = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsDeleteDialogOpen(true);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: "all" | TodoStatus) => {
    setStatus(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleEditDialogChange = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) setSelectedTodo(null);
  };

  const handleDeleteDialogChange = (open: boolean) => {
    setIsDeleteDialogOpen(open);
    if (!open) setSelectedTodo(null);
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

      <TodoTable table={table} isLoading={isLoading} />

      {data?.pagination && (
        <TodoPagination
          pagination={data.pagination}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      <CreateTodoDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />

      <UpdateTodoDialog todo={selectedTodo} open={isEditDialogOpen} onOpenChange={handleEditDialogChange} />

      <DeleteTodoDialog todo={selectedTodo} open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogChange} />
    </div>
  );
}
