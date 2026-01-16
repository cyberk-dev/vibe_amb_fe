# Widgets Layer - FSD Architecture Guide

> **Layer Purpose**: Large self-sufficient blocks of UI that are reused across pages.
> **Position**: Third layer from top in FSD hierarchy (below screens/).

## When AI Should Work in This Layer

- Creating large reusable UI blocks used on 2+ pages
- Building page layouts (headers, sidebars, footers)
- Composing features and entities into cohesive UI sections

## Core Principles

1. **Reusability** — Widgets MUST be reused across multiple pages
2. **Self-Sufficient** — Each widget is a complete, independent UI block
3. **Composition** — Widgets compose from features, entities, and shared

## When to Create a Widget

✅ **YES**: UI block reused on 2+ pages, page layouts, multiple large independent blocks
❌ **NO**: UI used only on ONE page → keep in `screens/{page}/ui/`

## Import Rules

```
widgets/ → features, entities, shared
```

**Never import from:** `app/`, `screens/`, other widgets

## Structure Pattern

```
widgets/{widget-name}/
├── ui/
│   └── {widget-name}.tsx
├── model/                  # Widget state (optional)
└── index.ts
```

## Examples

### Header Widget

```tsx
// widgets/header/ui/header.tsx
export function Header() {
  const { data: user } = useQuery(userQueries.me());

  return (
    <header>
      <Logo />
      <nav>...</nav>
      {user && <UserAvatar user={user} />}
      <LogoutButton />
    </header>
  );
}
```

### Widget with Slots

```tsx
// widgets/page-layout/ui/page-layout.tsx
interface PageLayoutProps {
  headerSlot?: React.ReactNode;
  sidebarSlot?: React.ReactNode;
  children: React.ReactNode;
}

export function PageLayout({ headerSlot, sidebarSlot, children }: PageLayoutProps) {
  return (
    <div>
      {headerSlot}
      <div className="flex">
        {sidebarSlot}
        <main>{children}</main>
      </div>
    </div>
  );
}
```

### Composing Features & Entities

```tsx
// widgets/post-feed/ui/post-feed.tsx
export function PostFeed({ filter }: { filter?: PostsFilter }) {
  const { data: posts } = useQuery(postQueries.list(filter));

  return (
    <div>
      {posts?.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          authorSlot={<UserAvatar userId={post.authorId} />}
          actionsSlot={<LikeButton postId={post.id} />}
        />
      ))}
    </div>
  );
}
```

## Decision Guide

| Scenario                | Location             | Reason              |
| ----------------------- | -------------------- | ------------------- |
| Header, Footer, Sidebar | `widgets/`           | Reused across pages |
| Page layout template    | `widgets/`           | Reused structure    |
| Complex form used once  | `screens/{page}/ui/` | Not reused          |
| Entity card/row         | `entities/ui/`       | Entity presentation |

## Anti-Patterns

❌ Create widget for UI used only on one page
❌ Put mutation logic directly in widgets → use features
❌ Import from screens or other widgets
