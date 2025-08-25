import { Button } from "@/components/ui/button";

interface CreatePostFormProps {
  title: string;
  content: string;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CreatePostForm = ({
  title,
  content,
  isLoading,
  hasError,
  errorMessage,
  onTitleChange,
  onContentChange,
  onSubmit,
}: CreatePostFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter post title..."
          disabled={isLoading}
          className="w-full px-3 py-2 border border-input rounded-md bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Write your post content..."
          rows={4}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-input rounded-md bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading || !title.trim() || !content.trim()}
        className="w-full"
      >
        {isLoading ? "Creating..." : "Create Post"}
      </Button>

      {hasError && errorMessage && (
        <div className="text-sm text-destructive">Error: {errorMessage}</div>
      )}
    </form>
  );
};
