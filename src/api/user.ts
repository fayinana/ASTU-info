import apiClient, { handleApiError } from "../lib/apiClient";
import {
  type GetUsersResponse,
  type GetUserResponse,
  type ProfileUpdateRequest,
  type GetUsersQuery,
  type ProfileUpdateResponse,
} from "./../types/user";

// Get all users with query parameters
export const fetchUsers = async (query: GetUsersQuery) => {
  try {
    const response = await apiClient.get<GetUsersResponse>("/users", query);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Get single user
export const fetchUser = async (id: string) => {
  try {
    const response = await apiClient.get<GetUserResponse>(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Update profile
export const updateProfile = async ({id , data}: {id: string, data: ProfileUpdateRequest}) => {
  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });
    const response = await apiClient.put<ProfileUpdateResponse>(
      `/users/profileUpdate/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
