import type { ApiResponse } from "./user";

// Author type for populated author and comment.author fields in Post
interface PostAuthor {
  _id: string;
  name: string;
  email: string;
  batch?: string;
  section?: string;
  school?: string;
  department?: string;
  profilePic?: string;
}

// Comment structure
interface PostComment {
  author: PostAuthor | string; // Populated as PostAuthor in getPost/getPosts, otherwise string
  text: string;
  email: string;
  profilepic?: string;
  createdAt: string; // ISO date string
}

// Post model
interface Post {
  _id: string;
  author: PostAuthor | string; // Populated as PostAuthor in getPost/getPosts, otherwise string
  type: "announcement" | "instructional" | "public";
  title: string;
  content: string;
  files: string[];
  target?: {
    batch?: string;
    section?: string;
    school?: string;
    department?: string;
  };
  like: string[]; // Array of User IDs
  comments: PostComment[];
  createdAt: string; // ISO date string
}

// Response type for getPosts endpoint
interface GetPostsResponse {
  status: "success";
  results: number;
  pagination: {
    total: number;
    limit: number;
    page: number;
    totalPages: number;
  };
  posts: Post[];
}

// Response type for getPost endpoint
interface GetPostResponse {
  success: boolean;
  post: Post;
}

// Response type for createPost endpoint
interface CreatePostResponse {
  success: boolean;
  message: string;
  data: Post;
}

// Response type for deletePost endpoint
interface DeletePostResponse {
  success: boolean;
  message: string;
}

// Request payload for createPost
interface CreatePostRequest {
  content: string;
  title: string;
  files?: File; // Single file for form-data upload
}

// Query parameters for getPosts endpoint
interface GetPostsQuery {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  fields?: string;
  [key: string]: any; // For additional filters
}

// Explicitly export types using 'export type'
export type {
  Post,
  PostAuthor,
  PostComment,
  GetPostsResponse,
  GetPostResponse,
  CreatePostResponse,
  DeletePostResponse,
  CreatePostRequest,
  GetPostsQuery,
};
