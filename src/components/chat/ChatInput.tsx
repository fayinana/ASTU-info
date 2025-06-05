 import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Paperclip, Image, Send, Smile, Mic, X } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatInputProps {
  onSendMessage: (message: string, file?: File) => void;
  scrollToBottom: () => void;
}

export const ChatInput = ({
  onSendMessage,
  scrollToBottom,
}: ChatInputProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const handleSend = () => {
    if (!newMessage.trim() && !selectedFile) return;

    onSendMessage(newMessage, selectedFile || undefined);
    setNewMessage("");
    setSelectedFile(null);

    // Scroll to bottom after sending
    setTimeout(scrollToBottom, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full">
      {selectedFile && (
        <div className="mb-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Paperclip className="w-4 h-4" />
              <span className="truncate max-w-[200px]">
                {selectedFile.name}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedFile(null)}
              className="h-6 w-6 text-gray-500 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {selectedFile.type.startsWith("image/") && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="max-h-32 rounded-md"
              />
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          "flex items-center gap-1 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 pr-2",
          isRecording ? "ring-2 ring-red-500 ring-opacity-50" : ""
        )}
      >
        <div className="flex-shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 text-gray-500 dark:text-gray-400 hover:text-primary"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            accept="image/*,.pdf,.doc,.docx"
          />
        </div>

        <Input
          className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {!isMobile && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 text-gray-500 dark:text-gray-400 hover:text-primary"
          >
            <Smile className="h-5 w-5" />
          </Button>
        )}

        {newMessage.trim() || selectedFile ? (
          <Button
            type="button"
            size="icon"
            className="rounded-full h-10 w-10 bg-[#9b87f5] hover:bg-[#7E69AB] text-white flex-shrink-0"
            onClick={handleSend}
          >
            <Send className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            size="icon"
            className="rounded-full h-10 w-10 bg-[#9b87f5] hover:bg-[#7E69AB] text-white flex-shrink-0"
            onClick={() => setIsRecording(!isRecording)}
          >
            <Mic className="h-4 w-4" />
            {isRecording && (
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
