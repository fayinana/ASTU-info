// import type { ApiResponse } from "./user";

interface MessageAuthor {
  _id: string;
  name: string;
  profilePic?: string;
}

interface Message {
  _id: string;
  conversationId: string;
  sender: MessageAuthor | string;
  text: string;
  createdAt: string;
}

interface Conversation {
  _id: string;
  participants: (MessageAuthor | string)[];
  lastMessage?: {
    text: string;
    sender: MessageAuthor | string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CreateMessageResponse {
  _id: string;
  conversationId: string;
  sender: string;
  text: string;
  createdAt: string;
}

interface GetMessagesResponse {
  [index: number]: Message;
}

interface GetConversationsResponse {
  [index: number]: Conversation;
}

interface CreateMessageRequest {
  recipientId: string;
  message: string;
}

export type {
  Message,
  Conversation,
  MessageAuthor,
  CreateMessageResponse,
  GetMessagesResponse,
  GetConversationsResponse,
  CreateMessageRequest,
};
