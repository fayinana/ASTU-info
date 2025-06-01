import { Conversation } from "@/types/message";
import { format, isToday, isYesterday } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { User } from "@/types/user";

interface ChatListProps {
  conversations: Conversation[];
  selectedConversation: string | null;
  onSelectConversation: (conversationId: string) => void;
  isUserOnline: (userId: string) => boolean;
  user: User;
}

export const ChatList = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  isUserOnline,
  user,
}: ChatListProps) => {
  const formatMessageDate = (date: string) => {
    const messageDate = new Date(date);
    if (isToday(messageDate)) {
      return format(messageDate, "HH:mm");
    } else if (isYesterday(messageDate)) {
      return "Yesterday";
    } else {
      return format(messageDate, "MMM d");
    }
  };

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
        <p>No conversations yet</p>
        <p className="text-sm">Start a new chat to begin messaging</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((conversation) => {
        const otherMember =
          user._id === conversation.participants[0]
            ? conversation.participants[0]
            : conversation.participants[1];
        console.log("====================================");
        console.log(user);
        console.log(conversation.participants[0]);
        console.log(conversation.participants[1]);
        console.log("====================================");
        const isOnline = isUserOnline(otherMember);

        return (
          <div
            key={conversation._id}
            className={cn(
              "flex items-start gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors",
              selectedConversation === conversation._id
                ? "bg-gray-200 dark:bg-gray-700"
                : ""
            )}
            onClick={() => onSelectConversation(conversation._id)}
          >
            <div className="relative">
              {<span>{conversation.participants[0].at(0)}</span>}
              {isOnline ? (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
              ) : (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-slate-300 border-2 border-white dark:border-gray-900 rounded-full"></span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="font-medium truncate dark:text-white">
                  {otherMember?.name || "Unknown User"}
                </h4>
                {conversation.lastMessage && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                    {formatMessageDate(conversation?.lastMessage?.createdAt)}
                  </span>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                {conversation.lastMessage &&
                  conversation.lastMessage.sender === user?.id && (
                    <Check className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" />
                  )}
                <p className="truncate">
                  {conversation.lastMessage
                    ? conversation.lastMessage.text ||
                      (conversation.lastMessage.file ? "File attachment" : "")
                    : "No messages yet"}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
