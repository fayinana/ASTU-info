import { likeDislikePost as likeDislikePostApi, replyToPost as replyToPostApi , deleteComment as deleteCommentApi} from "@/api/engagment"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export function useLikeDisLike(){
  const {mutate : likeDislike , isPending : isLoading , error } = useMutation({
    mutationFn : likeDislikePostApi,
    mutationKey : ["post"], 
    onSuccess(data){
      toast.success(data.message)
    }
  })
  return {likeDislike , isLoading, error}
}

export function useReplyPost(){
    const {mutate : replyPost , isPending : isLoading , error } = useMutation({
        mutationFn : replyToPostApi,
        mutationKey : ["post"], 
        onSuccess(data){
        toast.success(data.message)
        }
    })
    return {replyPost , isLoading, error}
}
export function useDeleteComment(){
    const {mutate : deleteComment , isPending : isLoading , error } = useMutation({
        mutationFn : deleteCommentApi,
        mutationKey : ["post"], 
        onSuccess(data){
        toast.success(data.message)
        }
    })
    return {deleteComment , isLoading, error}
}
