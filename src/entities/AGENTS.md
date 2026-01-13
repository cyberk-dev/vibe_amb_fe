# Entities Layer - FSD Architecture Guide

> **Layer Purpose**: Business domain concepts — GET/SEARCH operations, Query Factory, DTOs, and entity UI.
> **Position**: Fifth layer from top in FSD hierarchy (below features/).

## When AI Should Work in This Layer

- Creating business domain entities (User, Post, Product)
- Implementing GET/SEARCH API calls and Query Factory
- Defining DTOs and domain models
- Building entity UI components (cards, rows, avatars)

## Core Principles

1. **Read Operations Only** — Entities handle GET/SEARCH, NOT mutations
2. **Query Factory** — Centralized query definitions with queryOptions
3. **DTO Mapping** — Transform API DTOs to domain models
4. **Reusable UI** — Entity components use slots for flexibility

## Import Rules

```
entities/ → shared
```

**Never import from:** `app/`, `pages/`, `widgets/`, `features/`, other entities (use `@x`)

## Structure Pattern

```
entities/{entity-name}/
├── api/
│   ├── dto/{entity}.dto.ts
│   ├── {entity}-api.ts
│   └── {entity}.queries.ts
├── model/types.ts
├── ui/{entity}-card.tsx
└── index.ts
```

## Examples

### DTOs & Domain Models

```tsx
// api/dto/post.dto.ts — matches API response
export interface PostDto {
  id: string;
  author_id: string; // snake_case from API
  created_at: string;
}

// model/types.ts — domain model
export interface Post {
  id: string;
  authorId: string; // camelCase
  createdAt: Date; // parsed
}
```

### API Layer with Mapper

```tsx
// api/post-api.ts
const mapPost = (dto: PostDto): Post => ({
  id: dto.id,
  authorId: dto.author_id,
  createdAt: new Date(dto.created_at),
});

export const postApi = {
  getAll: async (filter?: PostsFilter) => {
    const { data } = await apiClient.get<PostDto[]>("/posts", { params: filter });
    return data.map(mapPost);
  },
  getById: async (id: string) => {
    const { data } = await apiClient.get<PostDto>(`/posts/${id}`);
    return mapPost(data);
  },
  // Mutations defined here, called from features
  create: (data: CreatePostDto) => apiClient.post("/posts", data),
  delete: (id: string) => apiClient.delete(`/posts/${id}`),
};
```

### Query Factory

```tsx
// api/post.queries.ts
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

### Entity UI with Slots

```tsx
// ui/post-card.tsx
interface PostCardProps {
  post: Post;
  authorSlot?: React.ReactNode; // Cross-entity content
  actionsSlot?: React.ReactNode; // Feature actions
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

### Public API

```tsx
// index.ts
export { postApi } from "./api/post-api";
export { postQueries } from "./api/post.queries";
export type { Post, PostsFilter } from "./model/types";
export type { CreatePostDto } from "./api/dto";
export { PostCard } from "./ui/post-card";
```

## Cross-Entity (@x notation)

```tsx
// entities/song/@x/artist.ts
export { type Artist } from "@/entities/artist";
```

## Decision Guide

| Scenario             | Location                | Reason            |
| -------------------- | ----------------------- | ----------------- |
| GET/Search API calls | `entities/{name}/api/`  | Read operations   |
| Query Factory        | `entities/{name}/api/`  | Query definitions |
| Domain models        | `entities/{name}/model` | Business types    |
| CREATE/UPDATE/DELETE | `features/`             | Mutations         |

## Anti-Patterns

❌ Put mutations in entities → use features
❌ Import from other entities directly → use `@x` or slots
❌ Skip DTO → Domain mapping → tight API coupling
