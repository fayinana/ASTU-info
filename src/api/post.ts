import apiClient, { handleApiError } from "../lib/apiClient";
import type {
  CreatePostRequest,
  CreatePostResponse,
  DeletePostResponse,
  GetPostResponse,
  GetPostsQuery,
  GetPostsResponse,
} from "../types/post";

export const fetchPosts = async (query: GetPostsQuery) => {
  try {
    const response = await apiClient.get<GetPostsResponse>("/posts", query);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchPost = async (id: string) => {
  try {
    const response = await apiClient.get<GetPostResponse>(`/posts/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createPost = async (data: CreatePostRequest) => {
  try {
    const formData = new FormData();
    formData.append("content", data.content);
    formData.append("title", data.title);
    if (data.files) formData.append("files", data.files);

    const response = await apiClient.post<CreatePostResponse>(
      "/posts",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deletePost = async (id: string) => {
  try {
    const response = await apiClient.delete<DeletePostResponse>(`/posts/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
