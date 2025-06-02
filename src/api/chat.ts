/* eslint-disable @typescript-eslint/no-explicit-any */
import { Message } from "@/types/message";
// import { User } from "@/types/user";
import apiClient, { handleApiError } from "@/lib/apiClient";
import {
  // CreateMessageRequest,
  GetConversationsResponse,
  GetMessagesResponse,
} from "@/types/message";

export const getConversations = async () => {
  try {
    const response = await apiClient.get<GetConversationsResponse>(
      "/messages/conversations"
    );

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getMessages = async (conversationId: string) => {
  try {
    const response = await apiClient.get<GetMessagesResponse>(
      `/messages/${conversationId}`
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const sendMessage = async ({
  reciverId,
  message,
}: {
  reciverId: string;
  message: string;
}): Promise<{ status: string; data: { message: Message } }> => {
  console.log("====================================");
  console.log(reciverId);
  console.log("====================================");
  try {
    const response = await apiClient.post<{
      status: string;
      data: { message: Message };
    }>(`/messages`, { recipientId: reciverId, message });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// export const getAdminUsers = async (): Promise<{
//   status: string;
//   data: {
//     users: User[];
//   };
//   pagination?: PaginationState | undefined;
// }> => {
//   return handleApiResponse<{
//     status: string;
//     data: {
//       users: User[];
//     };
//     pagination?: PaginationState | undefined;
//   }>(apiClient.get(`/users/admins`));
// };

// export const findConversation = async (
//   firstUserId: string,
//   secondUserId: string
// ): Promise<{
//   status: string;
//   data: {
//     conversations: Conversation[];
//   };
// } | null> => {
//   return handleApiResponse<{
//     status: string;
//     data: {
//       conversations: Conversation[];
//     };
//   } | null>(apiClient.get(`/conversation/find/${firstUserId}/${secondUserId}`));
// };
