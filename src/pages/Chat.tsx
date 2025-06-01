// import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Menu, Search, WifiOff, Wifi } from "lucide-react";
import { useState, Suspense, useEffect, useRef } from "react";
import { ChatList } from "@/components/chat/ChatList";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
// import { StartChatDialog } from "@/components/chat/StartChatDialog";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import {
  ChatListSkeleton,
  MessagesSkeleton,
} from "@/components/chat/ChatSkeleton";
import useGetMessages from "@/feature/chat/useGetMessages";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/AppLayout";

const Chat = () => {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const { user, isLoading } = useAuth();
  const {
    conversations,
    conversationsLoading,
    sendNewMessage,
    refetchConversation,
    isUserOnline,
  } = useChat();

  const { messages, messagesLoading } = useGetMessages(selectedConversation);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isConnected } = useSocket();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (messages && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    // On mobile, hide sidebar when a conversation is selected
    if (isMobile && selectedConversation) {
      setShowSidebar(false);
    }
  }, [selectedConversation, isMobile]);

  const handleSendMessage = async (message: string, file?: File) => {
    if (!selectedConversation) return;
    sendNewMessage({
      conversationId: selectedConversation,
      sender: user._id,
      text: message,
      file,
    });

    // Immediately scroll to bottom after sending
    setTimeout(scrollToBottom, 100);
  };

  const handleConversationCreated = (conversationId: string) => {
    setSelectedConversation(conversationId);
    if (isMobile) {
      setShowSidebar(false);
    }
    // Scroll to bottom when opening a conversation
    setTimeout(scrollToBottom, 300);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const filteredConversations = conversations?.filter((conversation) => {
    if (!searchTerm.trim()) return true;

    const otherMember =
      user?._id === conversation.members.receiver.id
        ? conversation.members.sender
        : conversation.members.receiver;

    return otherMember?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <AppLayout>
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* <Header /> */}
        <main className="flex-1 flex overflow-hidden">
          {/* Sidebar / Conversation List */}
          <div
            className={cn(
              "md:w-1/3 lg:w-1/4 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out",
              isMobile ? (showSidebar ? "w-full" : "w-0 hidden") : "w-1/3"
            )}
          >
            <div className="h-full flex flex-col p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold dark:text-white">
                  Messages
                </h2>
                <div className="flex items-center gap-2">
                  {isConnected ? (
                    <Wifi className="w-4 h-4 text-green-500" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {isConnected ? "Connected" : "Offline"}
                  </span>
                </div>
              </div>

              {/* {user?.role === "student" && (
              <div className="mb-4">
                <StartChatDialog
                  onConversationCreated={handleConversationCreated}
                  conversations={conversations}
                />
              </div>
            )} */}

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  className="pl-9 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex-1 overflow-y-auto">
                <Suspense fallback={<ChatListSkeleton />}>
                  {conversationsLoading && isLoading ? (
                    <ChatListSkeleton />
                  ) : (
                    <ChatList
                      conversations={filteredConversations || []}
                      selectedConversation={selectedConversation}
                      onSelectConversation={handleConversationCreated}
                      isUserOnline={isUserOnline}
                      user={user}
                    />
                  )}
                </Suspense>
              </div>
            </div>
          </div>

          {/* Chat Main Area */}
          <div
            className={cn(
              "flex-1 flex flex-col relative",
              isMobile && showSidebar ? "hidden" : "flex"
            )}
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="mr-2"
                >
                  {showSidebar ? (
                    <Menu className="w-5 h-5" />
                  ) : (
                    <ArrowLeft className="w-5 h-5" />
                  )}
                </Button>
              )}

              {selectedConversation &&
                conversations?.find((c) => c._id === selectedConversation) && (
                  <div className="flex items-center gap-3 p-3">
                    {(() => {
                      const selectedChat = conversations.find(
                        (c) => c._id === selectedConversation
                      );
                      if (!selectedChat) return null;

                      const otherMember =
                        user._id === selectedChat.members.receiver.id
                          ? selectedChat.members.sender
                          : selectedChat.members.receiver;

                      const isOnline = isUserOnline(otherMember?.id);

                      return (
                        <>
                          <div className="relative">
                            <img
                              src={otherMember?.photo || "/placeholder.svg"}
                              alt={otherMember?.name || "Contact"}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            {isOnline ? (
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
                            ) : (
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-slate-300 border-2 border-white dark:border-gray-900 rounded-full"></span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium dark:text-white">
                              {otherMember?.name || "Unknown User"}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {isOnline ? "Online" : "Offline"}
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
            </div>

            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900"
            >
              {selectedConversation ? (
                <Suspense fallback={<MessagesSkeleton />}>
                  {messagesLoading ? (
                    <MessagesSkeleton />
                  ) : messages?.length > 0 ? (
                    <div className="flex flex-col">
                      {messages.map((message) => (
                        <ChatMessage
                          key={message._id}
                          message={message}
                          isOwnMessage={message.sender === user?._id}
                        />
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      No messages yet. Start a conversation!
                    </div>
                  )}
                </Suspense>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                  {user?.role === "student"
                    ? "Select a conversation or start a new chat with an admin"
                    : "Select a conversation to start messaging"}
                </div>
              )}
            </div>

            {/* Chat Input */}
            {selectedConversation && (
              <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <ChatInput
                  onSendMessage={handleSendMessage}
                  scrollToBottom={scrollToBottom}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </AppLayout>
  );
};

export default Chat;
