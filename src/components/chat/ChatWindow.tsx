
import { useRef, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MessageInput } from "./MessageInput";
import { MessageBubble } from "./MessageBubble";
import { Chat, User, Message } from "@/lib/types";

interface ChatWindowProps {
  chat: Chat;
  currentUser: User;
  onSendMessage: (content: string) => void;
  isSubmitting?: boolean;
}

export const ChatWindow = ({
  chat,
  currentUser,
  onSendMessage,
  isSubmitting = false,
}: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);
  
  // Get the name of the other participant(s) for the chat title
  const getOtherParticipants = () => {
    const others = chat.participants.filter(
      (participant) => participant.id !== currentUser.id
    );
    
    if (others.length === 0) return "Personal Notes";
    if (others.length === 1) return others[0].name;
    if (others.length === 2) return `${others[0].name} and ${others[1].name}`;
    return `${others[0].name} and ${others.length - 1} others`;
  };
  
  // Organize messages by date
  const organizeMessagesByDate = () => {
    const messagesByDate: { [date: string]: Message[] } = {};
    
    chat.messages.forEach((message) => {
      const date = new Date(message.createdAt).toLocaleDateString();
      if (!messagesByDate[date]) {
        messagesByDate[date] = [];
      }
      messagesByDate[date].push(message);
    });
    
    return messagesByDate;
  };
  
  const messagesByDate = organizeMessagesByDate();
  
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="py-3">
        <CardTitle>{getOtherParticipants()}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {Object.entries(messagesByDate).map(([date, messages]) => (
            <div key={date} className="space-y-4">
              <div className="flex items-center justify-center">
                <Separator className="flex-grow" />
                <span className="px-2 text-xs text-muted-foreground">{date}</span>
                <Separator className="flex-grow" />
              </div>
              
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwnMessage={message.userId === currentUser.id}
                />
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <MessageInput
          onSendMessage={onSendMessage}
          disabled={isSubmitting}
        />
      </CardFooter>
    </Card>
  );
};

export default ChatWindow;
