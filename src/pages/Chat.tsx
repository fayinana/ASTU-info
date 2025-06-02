import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, ArrowLeft, MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import useGetConversations from "@/feature/chat/useGetConversations";
import useGetMessages from "@/feature/chat/useGetMessages";
import useSendMessage from "@/feature/chat/useSendMessage";

const Chat: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState<any | null>(
    null
  );
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { isSending, sendMissage } = useSendMessage(); // Initialize the hook

  const currentUser = user;
  const { conversations, conversationsLoading } = useGetConversations();

  // Determine recipient ID for fetching messages
  const recipientId = selectedConversation
    ? selectedConversation.participants[0]._id !== user?._id
      ? selectedConversation.participants[0]._id
      : null
    : null;

  const { messages: loadedMessages, messagesLoading } =
    useGetMessages(recipientId);

  // Update messages when loadedMessages changes
  useEffect(() => {
    if (loadedMessages) {
      setMessages(loadedMessages);
    }
  }, []);

  // Set the first conversation as selected when conversations are loaded
  useEffect(() => {
    if (conversations?.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, []);

  function sendMessage() {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    // Add the new message to the local state immediately
    const optimisticMessage = {
      _id: Date.now().toString(), // Temporary ID
      conversationId: selectedConversation._id,
      sender: user._id,
      text: newMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    sendMissage({
      reciverId: selectedConversation.participants[0]._id,
      message: newMessage,
    });

    setNewMessage(""); // Clear input after sending
  }

  if (!currentUser) {
    return <div className="container py-6">Loading...</div>;
  }

  return (
    <AppLayout>
      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {conversationsLoading ? (
                <div className="p-4 text-center">Loading conversations...</div>
              ) : conversations?.length > 0 ? (
                <div className="space-y-1">
                  {conversations?.map((conversation) => (
                    <div
                      key={conversation._id}
                      className={`p-4 border-b cursor-pointer hover:bg-muted transition-colors ${
                        selectedConversation?._id === conversation._id
                          ? "bg-muted"
                          : ""
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={conversation.participants[0]?.profilePic || ""}
                          />
                          <AvatarFallback>
                            {(
                              conversation.participants[0]?.name?.charAt(0) ||
                              "U"
                            ).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium truncate">
                              {conversation.participants[0]?.name ||
                                "Unknown User"}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {conversation.lastMessage?.text ||
                              "No messages yet"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No conversations yet</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate("/match-queue")}
                  >
                    Find Creators to Message
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden"
                      onClick={() => setSelectedConversation(null)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          selectedConversation.participants[0]?.profilePic || ""
                        }
                      />
                      <AvatarFallback>
                        {(
                          selectedConversation.participants[0]?.name?.charAt(
                            0
                          ) || "U"
                        ).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {selectedConversation.participants[0]?.name ||
                          "Unknown User"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedConversation.participants[0]?.subscriber_count?.toLocaleString() ||
                          "0"}{" "}
                        subscribers
                      </p>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messagesLoading ? (
                    <div className="text-center">Loading messages...</div>
                  ) : messages.length > 0 ? (
                    messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${
                          message.sender === user?._id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === user?._id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground">
                      No messages yet
                    </div>
                  )}
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      className="flex-1"
                      disabled={isSending}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || isSending}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Select a conversation</h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the sidebar to start messaging
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Chat;
