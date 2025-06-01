import { format } from "date-fns";
import { Message } from "@/types/chat";
import { FileIcon, Check, Clock } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
}

export const ChatMessage = ({ message, isOwnMessage }: ChatMessageProps) => {
  const messageRef = useRef<HTMLDivElement>(null);

  // We'll use this effect only for new messages that are being added
  useEffect(() => {
    // Only auto-scroll for messages that were just created (within the last second)
    const messageTime = new Date(message.createdAt).getTime();
    const now = new Date().getTime();
    const isNewMessage = now - messageTime < 1000;

    if (isNewMessage && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message.createdAt]);

  const renderFile = () => {
    if (!message.file) return null;

    if (message?.file) {
      return (
        <div className="mt-2 overflow-hidden rounded-lg">
          <img
            src={message?.file}
            alt="Shared image"
            className="max-w-[200px] object-cover rounded-lg"
            loading="lazy"
          />
        </div>
      );
    }

    return (
      <a
        href={message.file}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 flex items-center gap-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
      >
        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
          <FileIcon className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium overflow-hidden text-ellipsis">
          {message.file}
        </span>
      </a>
    );
  };

  const renderStatus = () => {
    if (!isOwnMessage) return null;

    switch (message.status) {
      case "pending":
        return <Clock className="w-3 h-3 text-gray-400 bg-white rounded-sm" />;
      case "sent":
        return <Check className="w-3 h-3 text-green-500 bg-white rounded-sm" />;
      case "error":
        return (
          <span className="text-xs text-red-500 bg-white rounded-sm">
            Failed
          </span>
        );
      default:
        return <Check className="w-3 h-3 text-green-500 bg-white rounded-sm" />;
    }
  };

  return (
    <div
      ref={messageRef}
      className={cn(
        "flex mb-4",
        isOwnMessage ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[75%] md:max-w-[60%] rounded-2xl px-4 py-2 shadow-sm",
          isOwnMessage
            ? "bg-[#9b87f5] text-white rounded-tr-none"
            : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none"
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        {renderFile()}
        <div
          className={cn(
            "flex items-center gap-1 mt-1",
            isOwnMessage ? "justify-end" : "justify-start"
          )}
        >
          <span className="text-xs opacity-70">
            {format(new Date(message.createdAt), "h:mm a")}
          </span>
          {renderStatus()}
        </div>
      </div>
    </div>
  );
};
