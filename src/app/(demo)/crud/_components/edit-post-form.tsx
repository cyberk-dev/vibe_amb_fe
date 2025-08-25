import { Button } from "@/components/ui/button";

interface EditPostFormProps {
  title: string;
  content: string;
  isLoading: boolean;
  hasChanges: boolean;
  hasError: boolean;
  errorMessage?: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const EditPostForm = ({
  title,
  content,
  isLoading,
  hasChanges,
  hasError,
  errorMessage,
  onTitleChange,
  onContentChange,
  onSubmit,
  onCancel,
}: EditPostFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="edit-title" className="block text-sm font-medium mb-2">
          Title
        </label>
        <input
          id="edit-title"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter post title..."
          disabled={isLoading}
          className="w-full px-3 py-2 border border-input rounded-md bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="edit-content"
          className="block text-sm font-medium mb-2"
        >
          Content
        </label>
        <textarea
          id="edit-content"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Write your post content..."
          rows={4}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-input rounded-md bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={
            isLoading || !title.trim() || !content.trim() || !hasChanges
          }
          className="flex-1"
        >
          {isLoading ? "Updating..." : "Update Post"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>

      {hasError && errorMessage && (
        <div className="text-sm text-destructive">Error: {errorMessage}</div>
      )}
    </form>
  );
};
