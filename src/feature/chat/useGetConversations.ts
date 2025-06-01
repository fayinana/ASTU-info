import { getConversations } from "@/api/chat";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";

function useGetConversations() {
  const { user } = useAuth();
  const {
    data,
    isLoading: conversationsLoading,
    refetch: refetchConversation,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
    enabled: !!user,
  });

  return {
    conversations: data || [],
    conversationsLoading,
    refetchConversation,
  };
}

export default useGetConversations;
