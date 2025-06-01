/* eslint-disable @typescript-eslint/no-explicit-any */
import { Message } from "@/types/message";
// import { User } from "@/types/user";
import apiClient, { handleApiError } from "@/lib/apiClient";
import {
  // CreateMessageRequest,
  GetConversationsResponse,
  GetMessagesResponse,
} from "@/types/message";
import axios from "axios";
// import { PaginationState } from "@/types/filters";
axios.defaults.withCredentials = true;
export const getConversations = async () => {
  try {
    // const response = await apiClient.get<GetConversationsResponse>(
    //   "/messages/conversation"
    // );
    const res = await axios.get(
      "https://gibi-ssvh.onrender.com/api/messages/conversation"
    );
    console.log(res);

    return res.data;
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

export const sendMessage = async (
  conversationId: string,
  sender: string,
  text: string,
  file?: any
): Promise<{ status: string; data: { message: Message } }> => {
  try {
    const formData = new FormData();
    formData.append("conversationId", conversationId);
    formData.append("sender", sender);
    formData.append("text", text);

    if (file) {
      formData.append("file", file);
    }
    const response = await apiClient.post<{
      status: string;
      data: { message: Message };
    }>(`/messages`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
