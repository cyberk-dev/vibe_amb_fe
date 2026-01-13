# Shared Layer - FSD Architecture Guide

> **Layer Purpose**: Foundation layer — infrastructure, UI kit, utilities, and configurations.
> **Position**: Bottom layer in FSD hierarchy (imported by all other layers).

## When AI Should Work in This Layer

- Setting up API client (Axios, fetch wrapper)
- Creating React Query client configuration
- Building reusable UI components (Button, Input, Card)
- Writing utility functions (formatDate, cn, debounce)

## Core Principles

1. **No Business Logic** — Only infrastructure and generic utilities
2. **No Slices** — Segments directly, no business domains
3. **Foundation** — All other layers depend on Shared

## Import Rules

```
shared/ → (nothing external, only internal + npm packages)
```

**Imported by:** `app/`, `pages/`, `widgets/`, `features/`, `entities/`

## Structure Pattern

```
shared/
├── api/          # API client, Query client
├── ui/           # Button, Input, Card, Dialog
├── lib/          # cn(), formatDate(), hooks
├── config/       # Environment variables
├── routes/       # Route constants
└── i18n/         # Translations
```

## Examples

### API Infrastructure

```tsx
// api/client.ts
export const apiClient = axios.create({
  baseURL: env.API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// api/query-client.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000 },
  },
});
```

### UI Components

```tsx
// ui/button.tsx
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
));
```

### Utilities

```tsx
// lib/utils.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US").format(new Date(date));
}

// lib/hooks/use-debounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
```

### Config

```tsx
// config/env.ts
export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL!,
  IS_DEV: process.env.NODE_ENV === "development",
};
```

### Routes

```tsx
// routes/paths.ts
export const ROUTES = {
  HOME: "/",
  POSTS: "/posts",
  POST_DETAIL: (id: string) => `/posts/${id}`,
};
```

## Segment Naming

| ✅ Good | ❌ Bad           | Reason             |
| ------- | ---------------- | ------------------ |
| `api/`  | `services/`      | Describes purpose  |
| `ui/`   | `components/`    | FSD convention     |
| `lib/`  | `utils/helpers/` | Avoid dump folders |

## Decision Guide

| Scenario               | Location      | Reason              |
| ---------------------- | ------------- | ------------------- |
| Axios instance         | `shared/api/` | Infrastructure      |
| Button, Input, Card    | `shared/ui/`  | Generic UI          |
| `cn()`, `formatDate()` | `shared/lib/` | Utilities           |
| User, Post, Product    | `entities/`   | Business → NOT here |

## Anti-Patterns

❌ Put business entities here → use `entities/`
❌ Create `utils/helpers/` dump folders → use focused `lib/` modules
❌ Import from higher layers
