# Screens Layer - FSD Architecture Guide

> **Layer Purpose**: Page composition — combines widgets, features, entities into complete views.
> **Position**: Second layer from top in FSD hierarchy (below app/).
> **Note**: Named `screens/` instead of `pages/` to avoid conflict with Next.js `pages/` directory.

## When AI Should Work in This Layer

- Composing complete page views from lower layers
- Creating page-specific layouts and structures
- Handling page-level routing props (params, searchParams)

## Core Principles

1. **Composition Only** — Screens NEVER contain business logic
2. **Single Responsibility** — One screen = one page/route
3. **Thin Layer** — Keep minimal, delegate to widgets/features/entities
4. **Screen-Specific UI** — UI used ONLY on this screen stays here

## Import Rules

```
screens/ → widgets, features, entities, shared
```

**Never import from:** `app/`, other screens

## Structure Pattern

```
screens/{screen-name}/
├── ui/{screen-name}-page.tsx
├── api/                    # Screen-only mutations (optional)
└── index.ts
```

## Examples

### Basic Screen

```tsx
// screens/dashboard/ui/dashboard-page.tsx
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

### Screen with Route Params

```tsx
// screens/post-detail/ui/post-detail-page.tsx
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
import { DashboardPage } from "@/screens/dashboard";

export default function Page() {
  return <DashboardPage />;
}

// app/posts/[id]/page.tsx
import { PostDetailPage } from "@/screens/post-detail";

export default function Page({ params }: { params: { id: string } }) {
  return <PostDetailPage postId={params.id} />;
}
```

## Decision Guide

| Scenario                          | Location              | Reason           |
| --------------------------------- | --------------------- | ---------------- |
| Page layout/structure             | `screens/{page}/ui/`  | Page composition |
| UI used only on this screen       | `screens/{page}/ui/`  | Not reused       |
| Mutation used only on this screen | `screens/{page}/api/` | No need feature  |
| Large reusable UI block           | `widgets/`            | Reused           |

## Anti-Patterns

❌ Fetch data directly in screens → use entity queries
❌ Put mutation logic in screens → create feature or screen-specific `api/`
❌ Import from other screens
❌ Create complex business logic → delegate to lower layers
