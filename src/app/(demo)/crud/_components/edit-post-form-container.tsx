"use client";

import { useState } from "react";
import { useUpdatePost } from "@/hooks/use-posts";
import { type Post } from "@/api/posts";
import { toast } from "sonner";
import { EditPostForm } from "./edit-post-form";

interface EditPostFormProps {
  post: Post;
  onCancel: () => void;
  onSuccess: () => void;
}

export const EditPostFormContainer = ({
  post,
  onCancel,
  onSuccess,
}: EditPostFormProps) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const updatePostMutation = useUpdatePost();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    // Check if anything actually changed
    if (title.trim() === post.title && content.trim() === post.content) {
      onCancel();
      return;
    }

    updatePostMutation.mutate(
      {
        id: post.id,
        data: { title: title.trim(), content: content.trim() },
      },
      {
        onSuccess: () => {
          onSuccess();
        },
        onError: (error) => {
          toast.error(`Failed to update post: ${error.message}`);
        },
      }
    );
  };

  const hasChanges =
    title.trim() !== post.title || content.trim() !== post.content;

  return (
    <EditPostForm
      title={title}
      content={content}
      isLoading={updatePostMutation.isPending}
      hasChanges={hasChanges}
      hasError={updatePostMutation.isError}
      errorMessage={updatePostMutation.error?.message}
      onTitleChange={setTitle}
      onContentChange={setContent}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
};
