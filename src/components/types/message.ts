import type { ApiResponse } from "./user";

// Author type for populated participants and lastMessage.sender in Conversation
interface MessageAuthor {
  _id: string;
  name: string;
  profilePic?: string;
}

// Message model (assumed based on controller usage)
interface Message {
  _id: string;
  conversationId: string;
  sender: MessageAuthor | string; // Populated as MessageAuthor if populated, otherwise string
  text: string;
  createdAt: string; // ISO date string
}

// Conversation model
interface Conversation {
  _id: string;
  participants: (MessageAuthor | string)[]; // Populated as MessageAuthor in GetConversations, otherwise string
  lastMessage?: {
    text: string;
    sender: MessageAuthor | string; // Populated as MessageAuthor if populated, otherwise string
  };
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Response type for CreateMessage endpoint
interface CreateMessageResponse {
  _id: string;
  conversationId: string;
  sender: string;
  text: string;
  createdAt: string; // ISO date string
}

// Response type for GetMessage endpoint
interface GetMessagesResponse {
  // Array of messages
  [index: number]: Message;
}

// Response type for GetConversations endpoint
interface GetConversationsResponse {
  // Array of conversations
  [index: number]: Conversation;
}

// Request payload for CreateMessage
interface CreateMessageRequest {
  recipientId: string;
  message: string;
}

// Explicitly export types using 'export type'
export type {
  Message,
  Conversation,
  MessageAuthor,
  CreateMessageResponse,
  GetMessagesResponse,
  GetConversationsResponse,
  CreateMessageRequest,
};
