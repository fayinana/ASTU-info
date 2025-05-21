/* eslint-disable @typescript-eslint/no-explicit-any */
interface BaseUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
  status: "approved" | "pending" | "rejected" | "suspended";
  profilePic?: string;
  bio?: string;
  
}

interface AdminUser extends BaseUser {
  role: "admin";
  title?: string;
}

interface TeacherUser extends BaseUser {
  role: "teacher";
  secAssigned?: {
    section: string;
    subject: string;
    department: string;
    school: string;
  }[];
  occupation?: string;
}

interface StudentUser extends BaseUser {
  role: "student";
  batch?: string;
  section?: string;
  school?: string;
  department?: string;
  studentID: string;
}

interface User {
    _id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
  status: "approved" | "pending" | "rejected" | "suspended";
  profilePic?: string;
  bio?: string;
   batch?: string;
  section?: string;
  school?: string;
  department?: string;
  studentID?: string;
    secAssigned?: {
    section?: string;
    subject?: string;
    department?: string;
    school?: string;
  }[];
  occupation?: string;
  title?: string;
  createdAt ?: string

}

interface GetUsersResponse {
  status: "success";
  results: number;
  pagination: {
    total: number;
    limit: number;
    page: number;
    totalPages: number;
  };
  users: User[];
}

interface GetUserResponse {
  success: boolean;
  data: User;
  message?: string;
}

interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  data: User;
}

interface ProfileUpdateRequest {
  name?: string;
  email?: string;
  bio?: string;
  batch?: string;
  section?: string;
  school?: string;
  department?: string;
  title?: string;
  occupation?: string;
  password?: string;
  profilePic?: File;
}

interface GetUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  fields?: string;
  [key: string]: any;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  totalPages?: number;
  currentPage?: number;
  totalResults?: number;
}

export type {
  User,
  GetUsersResponse,
  GetUserResponse,
  ProfileUpdateResponse,
  ProfileUpdateRequest,
  GetUsersQuery,
  ApiResponse,
};
