import { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
// import { useQueryClient } from "@tanstack/react-query";
import useGetConversations from "@/feature/chat/useGetConversations";
// import useStartConversation from "@/feature/chat/useStartConversation";
import useSendMessage from "@/feature/chat/useSendMessage";
// import toast from "sonner";

export const useChat = () => {
  const { socket, onlineUsers } = useSocket();
  const { user } = useAuth();
  // const queryClient = useQueryClient();

  const { conversations, conversationsLoading, refetchConversation } =
    useGetConversations();
  // const { startConversation, isStartingConversation } = useStartConversation();
  const { mutate: sendNewMessage } = useSendMessage();

  // Store messages in local state to allow real-time updates
  const [messages, setMessages] = useState<
    { senderId: string; text: string }[]
  >([]);

  useEffect(() => {
    if (socket && user) {
      socket.on("getMessage", (data: { senderId: string; text: string }) => {
        setMessages((prev) => [...prev, data]);

        // Check if the message is not from the current user (to avoid duplicate notifications)
        if (data.senderId !== user._id) {
          // toast.success("New message received");

          // Immediately refetch conversations to update the chat list
          refetchConversation();
        }
      });
    }

    return () => {
      socket?.off("getMessage");
    };
  }, [socket, user, refetchConversation]);

  // Function to check if a user is online
  const isUserOnline = (userId: string) => {
    return onlineUsers.some((user) => user.userId === userId);
  };

  return {
    conversations,
    conversationsLoading,
    // startConversation,
    sendNewMessage,
    messages,
    refetchConversation,
    onlineUsers,
    isUserOnline,
  };
};
