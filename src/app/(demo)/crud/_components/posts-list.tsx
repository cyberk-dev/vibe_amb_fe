import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { type Post } from "@/lib/api/posts";

interface PostsListProps {
  posts?: Post[];
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
  children?: React.ReactNode;
}

export const PostsList = ({
  posts,
  isError,
  errorMessage,
  onRetry,
  children,
}: PostsListProps) => {
  // Check data first - most common case (TkDodo pattern)
  if (posts) {
    return (
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No posts yet. Create your first post!
          </p>
        ) : (
          children
        )}
      </div>
    );
  }

  // Then check error state
  if (isError) {
    return (
      <div className="text-center py-8 space-y-2">
        <p className="text-destructive">
          An error occurred while loading posts
        </p>
        <p className="text-sm text-muted-foreground">{errorMessage}</p>
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      </div>
    );
  }

  // Finally loading state
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="space-y-2">
              <div className="h-5 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
