# FSD Layers Reference

## Layer Hierarchy

```
┌─────────────────────────────────────────────────┐
│  app/       Next.js routing shell, providers    │ ← No slices!
├─────────────────────────────────────────────────┤
│  screens/   FSD page composition                │ ← Named screens/ to avoid Next.js conflict
├─────────────────────────────────────────────────┤
│  widgets/   Large reusable UI blocks            │
├─────────────────────────────────────────────────┤
│  features/  User actions (MUTATIONS)            │
├─────────────────────────────────────────────────┤
│  entities/  Business data (GET/SEARCH + Queries)│
├─────────────────────────────────────────────────┤
│  shared/    UI kit, utilities, API client       │ ← No slices!
└─────────────────────────────────────────────────┘
```

## Key Principles

1. **App & Shared have NO slices** - directly contain segments
2. **Not everything needs to be a feature** - only create feature if reused on multiple pages
3. **Entity relationships** - business logic of entity interactions goes in higher layers (Features, Screens)
4. **Widgets are optional** - only create if UI block is reused OR page has multiple large independent blocks
5. **screens/ instead of pages/** - to avoid conflict with Next.js `pages/` directory

---

## app/ Layer

**Purpose:** Next.js routing shell, delegates to FSD screens.

```tsx
// app/dashboard/page.tsx
import { DashboardPage } from "@/screens/dashboard";

export const metadata = { title: "Dashboard" };

export default function Page() {
  return <DashboardPage />;
}

// app/posts/[id]/page.tsx
import { PostDetailPage } from "@/screens/post-detail";

export default function Page({ params }: { params: { id: string } }) {
  return <PostDetailPage postId={params.id} />;
}
```

---

## screens/ Layer

**Purpose:** Page composition - combines widgets, features, entities.

### Structure

```
screens/dashboard/
├── ui/
│   └── dashboard-page.tsx
└── index.ts
```

```tsx
// screens/dashboard/ui/dashboard-page.tsx
"use client";
import { Header } from "@/widgets/header";
import { PostList } from "@/entities/post";
import { CreatePostButton } from "@/features/create-post";

export function DashboardPage() {
  return (
    <main>
      <Header />
      <CreatePostButton />
      <PostList />
    </main>
  );
}

// screens/dashboard/index.ts
export { DashboardPage } from "./ui/dashboard-page";
```

---

## entities/ Layer

**Purpose:** Business data with GET/SEARCH operations using Query Factory pattern.

### Structure

```
entities/post/
├── api/
│   ├── post-api.ts         # All CRUD API calls
│   ├── post.queries.ts     # Query factory (React Query)
│   └── dto/                # Data Transfer Objects
│       ├── post.dto.ts
│       └── create-post.dto.ts
├── model/
│   └── types.ts
├── ui/
│   ├── post-card.tsx
│   └── post-list.tsx
└── index.ts
```

### DTO Layer (dto/)

```tsx
// entities/post/api/dto/post.dto.ts
export interface PostDto {
  id: string;
  title: string;
  content: string;
  author_id: string; // API snake_case
  created_at: string;
}

// entities/post/api/dto/create-post.dto.ts
export interface CreatePostDto {
  title: string;
  content: string;
}

export interface CreatePostResponseDto {
  id: string;
  title: string;
}
```

### API Layer (post-api.ts)

```tsx
// entities/post/api/post-api.ts
import { apiClient } from "@/shared/api";
import type { PostDto, CreatePostDto } from "./dto";
import type { Post } from "../model/types";

// Mapper: DTO → Domain Model
const mapPost = (dto: PostDto): Post => ({
  id: dto.id,
  title: dto.title,
  content: dto.content,
  authorId: dto.author_id, // snake_case → camelCase
  createdAt: dto.created_at,
});

export const postApi = {
  getAll: async (filter?: PostsFilter): Promise<Post[]> => {
    const { data } = await apiClient.get<PostDto[]>("/posts", { params: filter });
    return data.map(mapPost);
  },

  getById: async (id: string): Promise<Post> => {
    const { data } = await apiClient.get<PostDto>(`/posts/${id}`);
    return mapPost(data);
  },

  create: (data: CreatePostDto) => apiClient.post<Post>("/posts", data),

  update: (id: string, data: UpdatePostDto) => apiClient.patch<Post>(`/posts/${id}`, data),

  delete: (id: string) => apiClient.delete(`/posts/${id}`),
};
```

### Query Factory (post.queries.ts)

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

### Public API (index.ts)

```tsx
// entities/post/index.ts
export { postApi } from "./api/post-api";
export { postQueries } from "./api/post.queries";
export { PostCard } from "./ui/post-card";
export type { Post } from "./model/types";
export type { CreatePostDto } from "./api/dto";
```

---

## features/ Layer

**Purpose:** User actions that MUTATE data.

### ⚠️ Important: Not everything needs to be a feature!

Create a feature slice only when:

- The interaction is **reused on multiple pages**
- It represents a **significant product capability**

If an action is only used on one page, keep it in that page slice.

### Structure

```
features/create-post/
├── api/
│   └── use-create-post.ts   # React Query mutation hook
├── ui/
│   └── create-post-form.tsx
├── model/
│   └── schema.ts            # Zod validation
└── index.ts
```

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

  const handleSubmit = async (data: FormData) => {
    await mutateAsync({ title: data.get("title") as string });
    onSuccess?.();
  };

  return (
    <form action={handleSubmit}>
      <input name="title" required />
      <button disabled={isPending}>Create</button>
    </form>
  );
}
```

---

## widgets/ Layer

**Purpose:** Large self-contained UI blocks composing features/entities.

### ⚠️ When to create a widget:

- UI block is **reused across multiple pages**, OR
- Page has **multiple large independent blocks**

If a UI block makes up most of a page and is never reused, keep it **inside the page slice**.

```tsx
// widgets/header/ui/header.tsx
import { Logo } from "@/shared/ui";
import { UserMenu } from "@/entities/user";
import { SearchBar } from "@/features/search";

export function Header() {
  return (
    <header>
      <Logo />
      <SearchBar />
      <UserMenu />
    </header>
  );
}
```

---

## shared/ Layer

**Purpose:** Reusable code with no business logic.

### API Client

```tsx
// shared/api/client.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

// shared/api/query-client.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000 },
  },
});
```

---

## app/ Layer

**Purpose:** Next.js routing shell, delegates to FSD pages.

```tsx
// app/dashboard/page.tsx
import { DashboardPage } from "@/screens/dashboard";

export const metadata = { title: "Dashboard" };

export default function Page() {
  return <DashboardPage />;
}
```
