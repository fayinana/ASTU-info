
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Avatar } from "../user/Avatar";
import { formatRelativeTime, truncateText } from "@/lib/utils";
import { Chat, User, Message } from "@/lib/types";
import { Search, PlusCircle } from "lucide-react";

interface ChatSidebarProps {
  chats: Chat[];
  currentUser: User;
  selectedChatId: string | null;
  onSelectChat: (chat: Chat) => void;
  onCreateChat: () => void;
}

export const ChatSidebar = ({
  chats,
  currentUser,
  selectedChatId,
  onSelectChat,
  onCreateChat,
}: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get the name of the other participant(s) for each chat
  const getChatTitle = (chat: Chat) => {
    const others = chat.participants.filter(
      (participant) => participant.id !== currentUser.id
    );
    
    if (others.length === 0) return "Personal Notes";
    if (others.length === 1) return others[0].name;
    if (others.length === 2) return `${others[0].name} and ${others[1].name}`;
    return `${others[0].name} and ${others.length - 1} others`;
  };
  
  // Get the avatar for the chat (either the other person or the group)
  const getChatAvatar = (chat: Chat) => {
    const others = chat.participants.filter(
      (participant) => participant.id !== currentUser.id
    );
    
    if (others.length === 0) return currentUser;
    if (others.length === 1) return others[0];
    return others[0]; // Could be modified to show a group avatar
  };
  
  // Get the last message for each chat
  const getLastMessage = (chat: Chat): Message | null => {
    if (chat.messages.length === 0) return null;
    
    return chat.messages[chat.messages.length - 1];
  };
  
  // Filter chats based on search query
  const filteredChats = chats.filter((chat) => {
    if (!searchQuery) return true;
    
    const chatTitle = getChatTitle(chat).toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    
    // Search in chat title
    if (chatTitle.includes(searchLower)) return true;
    
    // Search in participant names
    const participantMatch = chat.participants.some((participant) =>
      participant.name.toLowerCase().includes(searchLower)
    );
    if (participantMatch) return true;
    
    // Search in messages
    const messageMatch = chat.messages.some((message) =>
      message.content.toLowerCase().includes(searchLower)
    );
    
    return messageMatch;
  });
  
  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Chats</h2>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={onCreateChat}
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search chats..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        {filteredChats.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">
            No chats found
          </div>
        ) : (
          filteredChats.map((chat) => {
            const isSelected = chat.id === selectedChatId;
            const chatTitle = getChatTitle(chat);
            const avatar = getChatAvatar(chat);
            const lastMessage = getLastMessage(chat);
            
            return (
              <button
                key={chat.id}
                className={`w-full text-left p-3 hover:bg-muted transition-colors flex items-center space-x-3 ${
                  isSelected ? "bg-muted" : ""
                }`}
                onClick={() => onSelectChat(chat)}
              >
                <Avatar user={avatar} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="font-medium truncate">{chatTitle}</p>
                    {lastMessage && (
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(lastMessage.createdAt)}
                      </p>
                    )}
                  </div>
                  {lastMessage ? (
                    <p className="text-sm text-muted-foreground truncate">
                      {lastMessage.userId === currentUser.id ? "You: " : ""}
                      {truncateText(lastMessage.content, 30)}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No messages yet
                    </p>
                  )}
                </div>
              </button>
            );
          })
        )}
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;
