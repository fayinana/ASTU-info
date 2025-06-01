import { apiClient, handleApiError } from "./../lib/apiClient";

interface ApiResponse {
  message: string;
}

interface ReplyRequest {
  text: string;
}

export interface GetPostsQuery {
  page?: number;
  limit?: number;
  type?: string;
}

export const likeDislikePost = async (postId: string) => {
  try {
    const response = await apiClient.post<ApiResponse>(
      `/engagement/likeDislike/${postId}`
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const replyToPost = async ({
  postId,
  data,
}: {
  postId: string;
  data: ReplyRequest;
}) => {
  try {
    const response = await apiClient.post<ApiResponse>(
      `/reply/${postId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteComment = async ({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}) => {
  try {
    const response = await apiClient.delete<ApiResponse>(
      `/deleteComment/${postId}/${commentId}`
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
