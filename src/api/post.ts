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
    const response = await apiClient.get<GetPostsResponse>("/post", query);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchPost = async (id: string) => {
  try {
    const response = await apiClient.get<GetPostResponse>(`/post/${id}`);
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
    formData.append("type" , data.type)
    if (data.files) formData.append("files", data.files);

    const response = await apiClient.post<CreatePostResponse>(
      "/post",
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
    const response = await apiClient.delete<DeletePostResponse>(`/post/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
