# FSD Segments Reference

Segments group code by technical purpose within slices.

## Standard Segments

| Segment    | Purpose                                  |
| ---------- | ---------------------------------------- |
| `ui/`      | React components                         |
| `api/`     | API calls, Query factory, Mutation hooks |
| `api/dto/` | Data Transfer Objects (API types)        |
| `model/`   | Domain types, schemas, stores            |
| `lib/`     | Slice-specific utilities                 |

---

## api/ Segment

### In Entities (Queries + DTO)

```
entities/post/api/
├── dto/
│   ├── post.dto.ts       # API response types
│   └── create-post.dto.ts
├── post-api.ts           # All CRUD API calls + mappers
├── post.queries.ts       # Query factory
└── index.ts
```

**dto/post.dto.ts** - API types (snake_case from server):

```tsx
export interface PostDto {
  id: string;
  title: string;
  author_id: string;
  created_at: string;
}
```

**post-api.ts** - API calls with DTO → Domain mapping:

```tsx
import { apiClient } from "@/shared/api";
import type { PostDto } from "./dto";
import type { Post } from "../model/types";

const mapPost = (dto: PostDto): Post => ({
  id: dto.id,
  title: dto.title,
  authorId: dto.author_id,
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

  delete: (id: string) => apiClient.delete(`/posts/${id}`),
};
```

**post.queries.ts** - Query factory:

```tsx
import { queryOptions } from "@tanstack/react-query";
import { postApi } from "./post-api";

export const postQueries = {
  all: () => ["posts"],

  lists: () => [...postQueries.all(), "list"],
  list: (filter?: PostsFilter) =>
    queryOptions({
      queryKey: [...postQueries.lists(), filter],
      queryFn: () => postApi.getAll(filter),
    }),

  details: () => [...postQueries.all(), "detail"],
  detail: (id: string) =>
    queryOptions({
      queryKey: [...postQueries.details(), id],
      queryFn: () => postApi.getById(id),
    }),
};
```

### In Features (Mutations)

```
features/create-post/api/
└── use-create-post.ts   # Mutation hook only
```

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

---

## ui/ Segment

```tsx
// entities/post/ui/post-card.tsx
interface PostCardProps {
  post: Post;
  actions?: React.ReactNode; // Slot for feature buttons
}

export function PostCard({ post, actions }: PostCardProps) {
  return (
    <Card>
      <h3>{post.title}</h3>
      {actions}
    </Card>
  );
}
```

---

## model/ Segment

**Types:**

```tsx
// entities/post/model/types.ts
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

export interface PostsFilter {
  page?: number;
  limit?: number;
}

export interface CreatePostInput {
  title: string;
  content: string;
}
```

**Validation Schema:**

```tsx
// features/create-post/model/schema.ts
import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
});
```

**Zustand Store:**

```tsx
// features/post-editor/model/store.ts
import { create } from "zustand";

interface EditorState {
  content: string;
  setContent: (content: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  content: "",
  setContent: (content) => set({ content }),
}));
```

---

## Public API (index.ts)

Each slice exports public API:

```tsx
// entities/post/index.ts
export { postApi } from "./api/post-api";
export { postQueries } from "./api/post.queries";
export { PostCard } from "./ui/post-card";
export type { Post } from "./model/types";
export type { CreatePostDto } from "./api/dto";

// features/create-post/index.ts
export { useCreatePost } from "./api/use-create-post";
export { CreatePostForm } from "./ui/create-post-form";
```

---

## Naming Conventions

| Type            | Convention                | Example                    |
| --------------- | ------------------------- | -------------------------- |
| Components      | PascalCase                | `PostCard.tsx`             |
| Hooks           | camelCase, use prefix     | `use-create-post.ts`       |
| API object      | camelCase, Api suffix     | `post-api.ts`              |
| Queries factory | camelCase, Queries suffix | `post.queries.ts`          |
| DTO             | PascalCase, Dto suffix    | `PostDto`, `CreatePostDto` |
| Domain Types    | PascalCase                | `Post`, `PostsFilter`      |
