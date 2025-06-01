
import { getMessages } from "@/api/chat";
import { useQuery } from "@tanstack/react-query";

function useGetMessages(conversationId: string) {
  const { data, isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessages(conversationId),
    enabled: !!conversationId,
  });

  const messages = data?.data?.messages || [];

  return { 
    messages, 
    messagesLoading 
  };
}

export default useGetMessages;
