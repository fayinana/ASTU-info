import { createPost as createPostApi, fetchPosts , fetchPost} from "@/api/post";
import { GetPostsQuery } from "@/types/post";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function usePosts(query: GetPostsQuery) {
  const { data, isLoading, refetch , error } = useQuery({
    queryKey: [
      "posts",
      query.fields,
      query.limit,
      query.page,
      query.search,
      query.sort,
    ],
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
    error,
    isLoading,
    refetch,
  };
}


export function useCreatePost(){
  const {mutate : createPost , isPending : isLoading , error } = useMutation({
    mutationFn : createPostApi,
    mutationKey : ["post"], 
    onSuccess(data){
      toast.success(data.message)
    }
  })
  return {createPost , isLoading, error}
}
 

export function usePost(id: string) {
  const { data, isLoading, refetch , error } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPost(id),
  });

  return {
    post: data?.post || null,
    error,
    isLoading,
    refetch,
  };
}