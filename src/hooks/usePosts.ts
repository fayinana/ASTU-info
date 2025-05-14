import { fetchPosts } from "@/api/post";
import { GetPostsQuery } from "@/types/post";
import { useQuery } from "@tanstack/react-query";

export function usePosts(query: GetPostsQuery) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["posts" , query],
    queryFn: () => fetchPosts(query),
  });

  return {
    posts: data?.posts || [],
    pagination: data?.pagination || {
      limit: 10,
      page: 1,
      total: 0,
      totalPages: 1,
    },
    isLoading,
    refetch,
  };
}
