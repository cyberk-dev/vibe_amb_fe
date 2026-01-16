# Entities Layer - FSD Architecture Guide

> **Layer Purpose**: Business domain concepts — GET/SEARCH operations, Query Factory, and entity UI.
> **Position**: Fifth layer from top in FSD hierarchy (below features/).

## When AI Should Work in This Layer

- Creating business domain entities (User, Post, Product)
- Implementing GET/SEARCH API calls and Query Factory
- Building entity UI components (cards, rows, avatars)
- Creating Zustand stores for entity state
- Defining custom domain models (only when different from backend DTOs)

## Core Principles

1. **Read Operations Only** — Entities handle GET/SEARCH, NOT mutations
2. **Query Factory** — Centralized query definitions with queryOptions
3. **Types from Swagger** — Use `ApiTypes` from `@/shared/api`, don't create DTOs
4. **Reusable UI** — Entity components use slots for flexibility
5. **Zustand Stores** — Entity-specific state in `model/store.ts`
6. **Public API** — Higher layers can ONLY import what's exported in `index.ts`

## Import Rules

```
entities/ → shared (via index.ts only)
```

**Never import from:** `app/`, `pages/`, `widgets/`, `features/`, other entities (use `@x`)
**Always import from:** `@/shared/api` for types (`ApiTypes`)

## Structure Pattern

```
entities/{entity-name}/
├── api/
│   ├── {entity}-api.ts      # CRUD operations
│   └── {entity}.queries.ts  # Query factory
├── model/
│   ├── types.ts             # Custom types (only if needed)
│   └── store.ts             # Zustand store (optional)
├── ui/{entity}-card.tsx
└── index.ts                 # Public API
```

## Examples

### Using Swagger Types (No custom DTOs needed)

```tsx
// api/post-api.ts
import { apiClient, ApiTypes } from "@/shared/api";

export const postApi = {
  getAll: async (filter?: ApiTypes.PostsFilter): Promise<ApiTypes.PostDto[]> => {
    const { data } = await apiClient.get<ApiTypes.PostDto[]>("/posts", { params: filter });
    return data;
  },
  getById: async (id: string): Promise<ApiTypes.PostDto> => {
    const { data } = await apiClient.get<ApiTypes.PostDto>(`/posts/${id}`);
    return data;
  },
  create: (data: ApiTypes.CreatePostRequest) => apiClient.post("/posts", data),
  delete: (id: string) => apiClient.delete(`/posts/${id}`),
};
```

### Custom Domain Model (Only when different from API)

```tsx
// model/types.ts — only create when you need custom structure
import { ApiTypes } from "@/shared/api";

export interface PostWithMeta extends ApiTypes.PostDto {
  isBookmarked: boolean; // Frontend-only property
  formattedDate: string; // Computed property
}
```

### Zustand Store

```tsx
// model/store.ts
import { create } from "zustand";

interface PostStore {
  selectedPostId: string | null;
  filters: { status?: string; category?: string };
  setSelectedPost: (id: string | null) => void;
  setFilters: (filters: Partial<PostStore["filters"]>) => void;
}

export const usePostStore = create<PostStore>((set) => ({
  selectedPostId: null,
  filters: {},
  setSelectedPost: (id) => set({ selectedPostId: id }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
}));
```

### Query Factory

```tsx
// api/post.queries.ts
import { queryOptions, keepPreviousData } from "@tanstack/react-query";
import { postApi } from "./post-api";
import { ApiTypes } from "@/shared/api";

export const postQueries = {
  all: () => ["posts"],
  lists: () => [...postQueries.all(), "list"],
  list: (filter?: ApiTypes.PostsFilter) =>
    queryOptions({
      queryKey: [...postQueries.lists(), filter],
      queryFn: () => postApi.getAll(filter),
      placeholderData: keepPreviousData,
    }),
  details: () => [...postQueries.all(), "detail"],
  detail: (id: string) =>
    queryOptions({
      queryKey: [...postQueries.details(), id],
      queryFn: () => postApi.getById(id),
    }),
};
```

### Entity UI with Slots

```tsx
// ui/post-card.tsx
import { ApiTypes } from "@/shared/api";

interface PostCardProps {
  post: ApiTypes.PostDto;
  authorSlot?: React.ReactNode;
  actionsSlot?: React.ReactNode;
}

export function PostCard({ post, authorSlot, actionsSlot }: PostCardProps) {
  return (
    <Card>
      {authorSlot}
      <h3>{post.title}</h3>
      {actionsSlot}
    </Card>
  );
}
```

### Public API (index.ts)

```tsx
// index.ts — ONLY these exports can be imported by higher layers
export { postApi } from "./api/post-api";
export { postQueries } from "./api/post.queries";
export { PostCard } from "./ui/post-card";
export { usePostStore } from "./model/store";
export type { PostWithMeta } from "./model/types"; // only custom types
```

## Cross-Entity (@x notation)

```tsx
// entities/song/@x/artist.ts
export { type Artist } from "@/entities/artist";
```

## Decision Guide

| Scenario             | Location                 | Reason                         |
| -------------------- | ------------------------ | ------------------------------ |
| GET/Search API calls | `entities/{name}/api/`   | Read operations                |
| Query Factory        | `entities/{name}/api/`   | Query definitions              |
| Zustand store        | `entities/{name}/model/` | Entity-specific state          |
| Custom domain models | `entities/{name}/model/` | Only if different from backend |
| CREATE/UPDATE/DELETE | `features/`              | Mutations                      |

## Anti-Patterns

❌ Create DTOs manually → use `ApiTypes` from swagger
❌ Put mutations in entities → use features
❌ Import from other entities directly → use `@x` or slots
❌ Import internal files from lower layers → only use `index.ts` exports
❌ Create types that duplicate backend DTOs → use `ApiTypes` directly
