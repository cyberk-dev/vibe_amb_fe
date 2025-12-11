// import apiClient from "./client"; // Not needed for mock implementation

export interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Mock posts data
const mockPosts: Post[] = [
  {
    id: "1",
    title: "Welcome to the platform",
    content: "This is your first post. You can create, edit, and delete posts.",
    author: { id: "1", name: "Demo User" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Getting started with APIs",
    content: "Learn how to use our API endpoints to manage your data.",
    author: { id: "2", name: "Admin User" },
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Mock API functions that simulate real API calls
export const mockGetPosts = async (): Promise<Post[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return mockPosts;
};

export const mockGetPost = async (id: string): Promise<Post> => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const post = mockPosts.find((p) => p.id === id);
  if (!post) {
    throw new Error("Post not found");
  }

  return post;
};

export const mockCreatePost = async (data: { title: string; content: string }): Promise<Post> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const newPost: Post = {
    id: `${mockPosts.length + 1}`,
    title: data.title,
    content: data.content,
    author: { id: "1", name: "Demo User" }, // In real app, get from auth
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockPosts.unshift(newPost);
  return newPost;
};

export const mockUpdatePost = async (id: string, data: { title: string; content: string }): Promise<Post> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const postIndex = mockPosts.findIndex((p) => p.id === id);
  if (postIndex === -1) {
    throw new Error("Post not found");
  }

  const updatedPost = {
    ...mockPosts[postIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  mockPosts[postIndex] = updatedPost;
  return updatedPost;
};

export const mockDeletePost = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const postIndex = mockPosts.findIndex((p) => p.id === id);
  if (postIndex === -1) {
    throw new Error("Post not found");
  }

  mockPosts.splice(postIndex, 1);
};

// API service functions (these would use apiClient in a real app)
export const postsApi = {
  getPosts: mockGetPosts,
  getPost: mockGetPost,
  createPost: mockCreatePost,
  updatePost: mockUpdatePost,
  deletePost: mockDeletePost,
};
