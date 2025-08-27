import { useQuery } from "@tanstack/react-query";
import { postsApi } from "@/api/posts";

// Query key factories following TkDodo's pattern
export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
} as const;

// Query hooks
export const usePostsQuery = () => {
  return useQuery({
    queryKey: postKeys.lists(),
    queryFn: postsApi.getPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes - posts data stays fresh
    gcTime: 10 * 60 * 1000, // 10 minutes - cache retention
  });
};

export const usePostQuery = (id: string) => {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postsApi.getPost(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
