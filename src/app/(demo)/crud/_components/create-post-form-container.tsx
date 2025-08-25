"use client";

import { useState } from "react";
import { useCreatePost } from "@/hooks/use-posts";
import { toast } from "sonner";
import { CreatePostForm } from "./create-post-form";

export const CreatePostFormContainer = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const createPostMutation = useCreatePost();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    createPostMutation.mutate(
      { title: title.trim(), content: content.trim() },
      {
        onSuccess: () => {
          toast.success("Post created successfully");
          setTitle("");
          setContent("");
        },
        onError: (error) => {
          toast.error(`Failed to create post: ${error.message}`);
        },
      }
    );
  };

  return (
    <CreatePostForm
      title={title}
      content={content}
      isLoading={createPostMutation.isPending}
      hasError={createPostMutation.isError}
      errorMessage={createPostMutation.error?.message}
      onTitleChange={setTitle}
      onContentChange={setContent}
      onSubmit={handleSubmit}
    />
  );
};
