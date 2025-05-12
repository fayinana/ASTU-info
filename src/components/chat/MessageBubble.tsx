
import { Avatar } from "../user/Avatar";
import { formatRelativeTime } from "@/lib/utils";
import { Message } from "@/lib/types";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export const MessageBubble = ({
  message,
  isOwnMessage,
}: MessageBubbleProps) => {
  const bubbleClasses = isOwnMessage
    ? "bg-primary text-white ml-auto"
    : "bg-secondary";
    
  const containerClasses = isOwnMessage
    ? "flex-row-reverse"
    : "flex-row";
    
  return (
    <div className={`flex items-end space-x-2 ${containerClasses}`}>
      {!isOwnMessage && (
        <div className="flex-shrink-0">
          <Avatar user={message.user} size="sm" />
        </div>
      )}
      
      <div className="max-w-[75%] space-y-1">
        {!isOwnMessage && (
          <p className="text-xs text-muted-foreground">
            {message.user.name}
          </p>
        )}
        
        <div
          className={`${bubbleClasses} px-4 py-2 rounded-lg`}
        >
          <p className="break-words">{message.content}</p>
        </div>
        
        <p className="text-xs text-muted-foreground text-right">
          {formatRelativeTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
