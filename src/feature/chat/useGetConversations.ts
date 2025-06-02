import { getConversations } from "@/api/chat";
import { useQuery } from "@tanstack/react-query";

function useGetConversations() {
  const {
    data,
    isLoading: conversationsLoading,
    refetch: refetchConversation,
  } = useQuery({
    queryKey: ["conversation"],
    queryFn: getConversations,
  });

  return {
    conversations: data || [],
    conversationsLoading,
    refetchConversation,
  };
}

export default useGetConversations;
