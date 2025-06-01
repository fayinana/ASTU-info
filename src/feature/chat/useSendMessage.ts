/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "@/api/chat";
import { Message } from "@/types/message";
import { toast } from "sonner";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";

const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({
      conversationId,
      sender,
      text,
      file,
    }: {
      conversationId: string;
      sender: string;
      text: string;
      file?: any;
    }) => sendMessage(conversationId, sender, text, file),

    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({
        queryKey: ["messages", newMessage.conversationId],
      });

      const previousMessages = queryClient.getQueryData<{
        data: { messages: Message[] };
      }>(["messages", newMessage.conversationId]);

      const optimisticMessage: Message = {
        _id: Date.now().toString(),
        conversationId: newMessage.conversationId,
        sender: newMessage.sender,
        text: newMessage.text,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData(
        ["messages", newMessage.conversationId],
        (old: any) => {
          // Ensure we properly handle the data structure
          if (!old) {
            return { data: { messages: [optimisticMessage] } };
          }

          if (old.data && Array.isArray(old.data.messages)) {
            return {
              ...old,
              data: {
                ...old.data,
                messages: [...old.data.messages, optimisticMessage],
              },
            };
          }

          // If old is an array (previous implementation)
          if (Array.isArray(old)) {
            return { data: { messages: [...old, optimisticMessage] } };
          }

          // Fallback
          return { data: { messages: [optimisticMessage] } };
        }
      );

      // Get conversation to find receiver
      const conversations = queryClient.getQueryData<any>(["conversations"]);
      const currentConversation = conversations.data.conversations?.find(
        (c: any) => c._id === newMessage.conversationId
      );

      if (currentConversation && socket && user) {
        const receiverId =
          user._id === currentConversation.members.sender.id
            ? currentConversation.members.receiver.id
            : currentConversation.members.sender.id;

        // Emit socket event for real-time messaging
        socket.emit("sendMessage", {
          senderId: user._id,
          receiverId,
          text: newMessage.text,
        });
      }

      return { previousMessages };
    },

    onSuccess: (result, variables) => {
      queryClient.setQueryData(
        ["messages", variables.conversationId],
        (old: any) => {
          if (!old) return old;

          return old;
        }
      );

      // Also update the conversations list to show the latest message
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },

    onError: (error, variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["messages", variables.conversationId],
          context.previousMessages
        );
      }
      toast.error("Failed to send message");
    },
  });
};

export default useSendMessage;
