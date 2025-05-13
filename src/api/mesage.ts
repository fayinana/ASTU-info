import apiClient, { handleApiError } from "../lib/apiClient";
import type {
  CreateMessageRequest,
  CreateMessageResponse,
  GetConversationsResponse,
  GetMessagesResponse,
} from "../types/message";

export const createMessage = async (data: CreateMessageRequest) => {
  try {
    const response = await apiClient.post<CreateMessageResponse>(
      "/messages",
      data
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getMessages = async (otherId: string) => {
  try {
    const response = await apiClient.get<GetMessagesResponse>(
      `/messages/${otherId}`
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getConversations = async () => {
  try {
    const response = await apiClient.get<GetConversationsResponse>(
      "/conversations"
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
