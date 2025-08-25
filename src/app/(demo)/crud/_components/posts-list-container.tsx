"use client";

import { useState } from "react";
import { usePosts, useDeletePost } from "@/hooks/use-posts";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { toast } from "sonner";
import { PostsList } from "./posts-list";
import { PostCard } from "./post-card";
import { EditPostFormContainer } from "./edit-post-form-container";

export const PostsListContainer = () => {
  const { data: posts, error, isError } = usePosts();
  const deletePostMutation = useDeletePost();
  const { showConfirm } = useConfirmDialog();
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    const confirmed = await showConfirm({
      title: "Delete Post",
      description: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (confirmed) {
      deletePostMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Post deleted successfully");
        },
        onError: (error) => {
          toast.error(`Failed to delete post: ${error.message}`);
        },
      });
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <PostsList
      posts={posts}
      isError={isError}
      errorMessage={error?.message}
      onRetry={handleRetry}
    >
      {posts?.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          isDeleting={
            deletePostMutation.isPending &&
            deletePostMutation.variables === post.id
          }
          isEditing={editingPostId === post.id}
          onEdit={() => setEditingPostId(post.id)}
          onDelete={() => handleDelete(post.id, post.title)}
          editComponent={
            <EditPostFormContainer
              post={post}
              onCancel={() => setEditingPostId(null)}
              onSuccess={() => {
                setEditingPostId(null);
                toast.success("Post updated successfully");
              }}
            />
          }
        />
      ))}
    </PostsList>
  );
};
