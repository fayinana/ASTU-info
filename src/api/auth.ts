import {
  type RegisterResponse,
  type AdminRegisterResponse,
  type LoginResponse,
  type LogoutResponse,
  type ApprovalResponse,
  type TeacherResponsibilitiesResponse,
  type GetProfileResponse,
  type RegisterRequest,
  type AdminRegisterRequest,
  type LoginRequest,
  type TeacherResponsibilitiesRequest,
} from "./../types/auth";
import apiClient from "./../lib/apiClient";
import { handleApiError } from "../lib/apiClient";

// Register a user
export const register = async (data: RegisterRequest) => {
  try {
    console.log("====================================");
    console.log(data);
    console.log("====================================");
    const response = await apiClient.post<RegisterResponse>(
      "/auth/register",
      data
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Register an admin
export const adminRegister = async (data: AdminRegisterRequest) => {
  try {
    const response = await apiClient.post<AdminRegisterResponse>(
      "/admin/register",
      data
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Login
export const login = async (data: LoginRequest) => {
  try {
    const response = await apiClient.post<LoginResponse>("/auth/login", data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Logout
export const logout = async () => {
  try {
    const response = await apiClient.post<LogoutResponse>("/auth/logout");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Approve/suspend/reject a user
export const approveUser = async ({
  id,
  userStatus,
}: {
  id: string;
  userStatus: "approve" | "suspend" | "reject";
}) => {
  try {
    const response = await apiClient.put<ApprovalResponse>(
      `/users/${id}/status/${userStatus}`
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Assign teacher responsibilities
export const assignTeacherResponsibilities = async (
  id: string,
  data: TeacherResponsibilitiesRequest
) => {
  try {
    const response = await apiClient.put<TeacherResponsibilitiesResponse>(
      `/teachers/${id}/responsibilities`,
      data
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Get current user profile
export const getProfile = async () => {
  try {
    const response = await apiClient.get<GetProfileResponse>("/profile");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
