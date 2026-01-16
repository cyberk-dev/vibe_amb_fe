---
name: cyberk-fsd-fe
description: Build Next.js applications using Feature Sliced Design (FSD) methodology. Organizes code into layers (app, pages, widgets, features, entities, shared) with clear separation - entities for data fetching/search, features for mutations. Uses React Query for data fetching, Zustand for state management. Use when creating Next.js apps with FSD architecture, organizing React code by business domain, or implementing scalable frontend structure.
---

# CyberK FSD Frontend

Next.js + Feature Sliced Design with React Query patterns.

## When to Use This Skill

- Building Next.js applications with scalable architecture
- Organizing React code by business domain
- Implementing data fetching with React Query (queries + mutations)
- Setting up FSD layer structure (app, pages, widgets, features, entities, shared)
- Creating reusable entity components with query factories
- Implementing mutation features with proper cache invalidation

## Core Principles

- **Entities**: GET/SEARCH operations + Query Factory (DTOs from swagger)
- **Features**: MUTATIONS only + Mutation Hooks
- **Import Rule**: Only import from layers below via their `index.ts` exports
- **Types**: DTOs/entities generated from swagger → `ApiTypes` in `@/shared/api`

## Project Structure

```
src/
├── app/                    # Next.js routing shell
├── pages/                  # FSD page composition
├── widgets/                # Large UI blocks
├── features/               # MUTATIONS (useMutation hooks)
│   └── create-post/
│       ├── api/
│       │   └── use-create-post.ts
│       ├── ui/
│       └── index.ts
├── entities/               # GET/SEARCH (Query Factory)
│   └── post/
│       ├── api/
│       │   ├── post-api.ts       # All CRUD calls
│       │   └── post.queries.ts   # Query factory
│       ├── model/
│       │   ├── types.ts          # Custom domain models (if needed)
│       │   └── store.ts          # Zustand store (optional)
│       ├── ui/
│       └── index.ts
└── shared/
    ├── api/
    │   ├── client.ts             # Axios instance
    │   └── query-client.ts       # React Query client
    ├── ui/
    └── lib/
```

## Layer Import Rules

```
app/      → pages, widgets, features, entities, shared (via index.ts)
pages/    → widgets, features, entities, shared (via index.ts)
widgets/  → features, entities, shared (via index.ts)
features/ → entities, shared (via index.ts)
entities/ → shared (via index.ts)
shared/   → (nothing)
```

**Rules:**

- Never import from same layer!
- Only import what's exported from `index.ts` of lower layers

---

## Types from Swagger

DTOs and entity types are auto-generated from backend swagger API:

```tsx
// Import types from swagger
import { ApiTypes } from "@/shared/api";

// Use directly
type Post = ApiTypes.PostDto;
type CreatePostRequest = ApiTypes.CreatePostRequest;
```

Only create custom types in `entities/{name}/model/` when you need:

- Transformed/enriched domain models
- Frontend-specific computed properties
- Different structure than backend DTO

---

## Entity Pattern (Query Factory)

### 1. API Layer (post-api.ts)

```tsx
// entities/post/api/post-api.ts
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

  create: (data: ApiTypes.CreatePostRequest) => apiClient.post<ApiTypes.PostDto>("/posts", data),

  update: (id: string, data: ApiTypes.UpdatePostRequest) => apiClient.patch<ApiTypes.PostDto>(`/posts/${id}`, data),

  delete: (id: string) => apiClient.delete(`/posts/${id}`),
};
```

### 2. Query Factory (post.queries.ts)

```tsx
// entities/post/api/post.queries.ts
import { queryOptions, keepPreviousData } from "@tanstack/react-query";
import { postApi } from "./post-api";

export const postQueries = {
  all: () => ["posts"],

  lists: () => [...postQueries.all(), "list"],
  list: (filter?: PostsFilter) =>
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
      staleTime: 5000,
    }),
};
```

### 3. Model Layer (Optional - only if custom types needed)

```tsx
// entities/post/model/types.ts (only when different from API)
import { ApiTypes } from "@/shared/api";

export interface PostWithMeta extends ApiTypes.PostDto {
  isBookmarked: boolean; // Frontend-only property
  formattedDate: string; // Computed property
}
```

### 4. Zustand Store (Optional)

```tsx
// entities/post/model/store.ts
import { create } from "zustand";

interface PostStore {
  selectedPostId: string | null;
  setSelectedPost: (id: string | null) => void;
}

export const usePostStore = create<PostStore>((set) => ({
  selectedPostId: null,
  setSelectedPost: (id) => set({ selectedPostId: id }),
}));
```

### 5. Usage in Components

```tsx
import { useQuery } from "@tanstack/react-query";
import { postQueries } from "@/entities/post";

const { data: posts } = useQuery(postQueries.list({ page: 1 }));
const { data: post } = useQuery(postQueries.detail(id));
```

### 5. Public API (index.ts)

```tsx
// entities/post/index.ts
export { postApi } from "./api/post-api";
export { postQueries } from "./api/post.queries";
export { PostCard } from "./ui/post-card";
export { usePostStore } from "./model/store"; // if exists
export type { PostWithMeta } from "./model/types"; // only custom types
```

---

## Feature Pattern (Mutations)

### Mutation Hook

```tsx
// features/create-post/api/use-create-post.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postApi, postQueries } from "@/entities/post";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postQueries.lists() });
    },
  });
};
```

### Feature UI

```tsx
// features/create-post/ui/create-post-form.tsx
"use client";
import { useCreatePost } from "../api/use-create-post";

export function CreatePostForm({ onSuccess }: { onSuccess?: () => void }) {
  const { mutateAsync, isPending } = useCreatePost();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await mutateAsync({ title: formData.get("title") as string });
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" required />
      <button disabled={isPending}>Create</button>
    </form>
  );
}
```

---

## Shared Layer

### API Client (Axios)

```tsx
// shared/api/client.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});
```

### Query Client

```tsx
// shared/api/query-client.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000 },
  },
});
```

---

## Cross-Slice UI (Slots Pattern)

```tsx
// entities/post/ui/post-card.tsx
interface PostCardProps {
  post: Post;
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

// Usage in pages/
<PostCard
  post={post}
  authorSlot={<UserAvatar userId={post.authorId} />}
  actionsSlot={<LikeButton postId={post.id} />}
/>;
```

---

## Decision Guide

**"Where should I put this code?"**

| Scenario                        | Layer                         | Reason                              |
| ------------------------------- | ----------------------------- | ----------------------------------- |
| API client, axios instance      | `shared/api/`                 | Infrastructure, no business logic   |
| Reusable Button, Input          | `shared/ui/`                  | Generic UI kit                      |
| User, Post, Product data        | `entities/{name}/`            | Business domain entity              |
| GET/Search data + Query factory | `entities/{name}/api/`        | Read operations belong to entities  |
| Create/Update/Delete action     | `features/{action}-{entity}/` | Mutations are features              |
| Action used on ONE page only    | `pages/{page}/`               | No need for feature if not reused   |
| Large reused UI block           | `widgets/{name}/`             | Reused across pages                 |
| UI block for ONE page only      | `pages/{page}/ui/`            | Keep in page, not widget            |
| Page composition                | `pages/{name}/`               | Combine widgets, features, entities |
| Route definition                | `app/`                        | Next.js routing shell               |

**"Should I create a feature?"**

- ✅ YES if: Reused on 2+ pages
- ❌ NO if: Only used on 1 page → keep in page slice

**"Should I create a widget?"**

- ✅ YES if: Reused on 2+ pages OR page has multiple independent large blocks
- ❌ NO if: Only used on 1 page → keep in page slice

**"Entity A needs Entity B data?"**

- Prefer: Pass data via props from higher layer
- If must: Use `@x` notation (`entities/A/@x/B.ts`)

---

## Quick Checklist

**New Entity:**

- [ ] Create `api/{entity}-api.ts` with CRUD (use `ApiTypes` from swagger)
- [ ] Create `api/{entity}.queries.ts` with query factory
- [ ] Create `model/types.ts` ONLY if custom domain models needed
- [ ] Create `model/store.ts` for Zustand store (optional)
- [ ] Export via `index.ts`

**New Feature:**

- [ ] Create `api/use-{action}-{entity}.ts` mutation hook
- [ ] Import from entity's `index.ts` only (postApi, postQueries)
- [ ] Invalidate queries on success
- [ ] Create UI components

---

## Reference Navigation

**FSD Architecture:**

- [FSD Layers](./references/fsd-layers.md) - Layer hierarchy and patterns
- [FSD Segments](./references/fsd-segments.md) - Segment organization (api/, ui/, model/)
- [FSD Import Rules](./references/fsd-import-rules.md) - Dependency management

**Next.js Integration:**

- [App Router Architecture](./references/nextjs-app-router.md) - Routing, layouts, pages
- [Server Components](./references/nextjs-server-components.md) - RSC patterns, streaming
- [Optimization](./references/nextjs-optimization.md) - Images, fonts, bundles

**UI Components:**

- [RemixIcon Integration](./references/remix-icon-integration.md) - Icons usage

## Resources

- Feature Sliced Design: https://feature-sliced.design
- Next.js App Router: https://nextjs.org/docs
- React Query: https://tanstack.com/query
- Zustand: https://zustand-demo.pmnd.rs
