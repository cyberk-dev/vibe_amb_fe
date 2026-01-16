# Pages Layer - FSD Architecture Guide

> **Layer Purpose**: Page composition — combines widgets, features, entities into complete views.
> **Position**: Second layer from top in FSD hierarchy (below app/).

## When AI Should Work in This Layer

- Composing complete page views from lower layers
- Creating page-specific layouts and structures
- Handling page-level routing props (params, searchParams)

## Core Principles

1. **Composition Only** — Pages NEVER contain business logic
2. **Single Responsibility** — One page = one screen/route
3. **Thin Layer** — Keep minimal, delegate to widgets/features/entities
4. **Page-Specific UI** — UI used ONLY on this page stays here

## Import Rules

```
pages/ → widgets, features, entities, shared
```

**Never import from:** `app/`, other pages

## Structure Pattern

```
pages/{page-name}/
├── ui/{page-name}-page.tsx
├── api/                    # Page-only mutations (optional)
└── index.ts
```

## Examples

### Basic Page

```tsx
// pages/dashboard/ui/dashboard-page.tsx
export function DashboardPage() {
  return (
    <main>
      <Header />
      <CreatePostButton />
      <PostList />
    </main>
  );
}
```

### Page with Route Params

```tsx
// pages/post-detail/ui/post-detail-page.tsx
export function PostDetailPage({ postId }: { postId: string }) {
  const { data: post } = useQuery(postQueries.detail(postId));

  if (!post) return <Loading />;

  return (
    <main>
      <PostCard post={post} actionsSlot={<EditPostButton postId={postId} />} />
    </main>
  );
}
```

### Connection with app/

```tsx
// app/dashboard/page.tsx
import { DashboardPage } from "@/pages/dashboard";

export default function Page() {
  return <DashboardPage />;
}

// app/posts/[id]/page.tsx
import { PostDetailPage } from "@/pages/post-detail";

export default function Page({ params }: { params: { id: string } }) {
  return <PostDetailPage postId={params.id} />;
}
```

## Decision Guide

| Scenario                        | Location            | Reason           |
| ------------------------------- | ------------------- | ---------------- |
| Page layout/structure           | `pages/{page}/ui/`  | Page composition |
| UI used only on this page       | `pages/{page}/ui/`  | Not reused       |
| Mutation used only on this page | `pages/{page}/api/` | No need feature  |
| Large reusable UI block         | `widgets/`          | Reused           |

## Anti-Patterns

❌ Fetch data directly in pages → use entity queries
❌ Put mutation logic in pages → create feature or page-specific `api/`
❌ Import from other pages
❌ Create complex business logic → delegate to lower layers
