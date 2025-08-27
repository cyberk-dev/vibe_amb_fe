import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postsApi, type Post } from "@/api/posts";
import { postKeys } from "./use-posts-query";

// Mutation hooks
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postsApi.createPost,
    onMutate: async (newPost) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });

      // Snapshot previous value
      const previousPosts = queryClient.getQueryData<Post[]>(postKeys.lists());

      // Optimistically update cache
      if (previousPosts) {
        const optimisticPost: Post = {
          id: "temp-" + Date.now(),
          title: newPost.title,
          content: newPost.content,
          author: { id: "1", name: "Demo User" },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        queryClient.setQueryData(postKeys.lists(), [
          optimisticPost,
          ...previousPosts,
        ]);
      }

      return { previousPosts };
    },
    onError: (err, newPost, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(postKeys.lists(), context.previousPosts);
      }
    },
    onSuccess: (data) => {
      // Seed the individual post cache
      queryClient.setQueryData(postKeys.detail(data.id), data);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { title: string; content: string };
    }) => postsApi.updatePost(id, data),
    onMutate: async ({ id, data: updatedData }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: postKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });

      // Snapshot previous values
      const previousPost = queryClient.getQueryData<Post>(postKeys.detail(id));
      const previousPosts = queryClient.getQueryData<Post[]>(postKeys.lists());

      // Optimistically update individual post
      if (previousPost) {
        const optimisticPost = {
          ...previousPost,
          ...updatedData,
          updatedAt: new Date().toISOString(),
        };
        queryClient.setQueryData(postKeys.detail(id), optimisticPost);
      }

      // Optimistically update posts list
      if (previousPosts) {
        const updatedPosts = previousPosts.map((post) =>
          post.id === id
            ? { ...post, ...updatedData, updatedAt: new Date().toISOString() }
            : post
        );
        queryClient.setQueryData(postKeys.lists(), updatedPosts);
      }

      return { previousPost, previousPosts };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousPost) {
        queryClient.setQueryData(postKeys.detail(id), context.previousPost);
      }
      if (context?.previousPosts) {
        queryClient.setQueryData(postKeys.lists(), context.previousPosts);
      }
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postsApi.deletePost,
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });

      // Snapshot previous value
      const previousPosts = queryClient.getQueryData<Post[]>(postKeys.lists());

      // Optimistically remove from cache
      if (previousPosts) {
        const filteredPosts = previousPosts.filter((post) => post.id !== id);
        queryClient.setQueryData(postKeys.lists(), filteredPosts);
      }

      return { previousPosts };
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(postKeys.lists(), context.previousPosts);
      }
    },
    onSuccess: (data, id) => {
      // Remove individual post from cache
      queryClient.removeQueries({ queryKey: postKeys.detail(id) });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};
