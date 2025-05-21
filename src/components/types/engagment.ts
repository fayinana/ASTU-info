interface ApiResponse {
  message: string;
}

interface ReplyRequest {
  text: string;
}

export interface GetPostsQuery {
  // Define query parameters for fetchPosts if needed (e.g., page, limit)
  page?: number;
  limit?: number;
  type?: string;
}
