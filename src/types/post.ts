// import type { ApiResponse } from "./user";

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

interface PostComment {
  author: PostAuthor | string;
  text: string;
  email: string;
  profilepic?: string;
  createdAt: string;
}

interface Post {
  _id: string;
  author: PostAuthor;
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
  like: string[];
  // TODO
  comments: PostComment[];
  createdAt: string;
}

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

interface GetPostResponse {
  success: boolean;
  post: Post;
}

interface CreatePostResponse {
  success: boolean;
  message: string;
  data: Post;
}

interface DeletePostResponse {
  success: boolean;
  message: string;
}

interface CreatePostRequest {
  content: string;
  title: string;
  files?: File;
}

interface GetPostsQuery {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  fields?: string;
  [key: string]: any;
}

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
