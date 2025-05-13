import type { User } from "./user";

// Type for teacher section assignments
interface TeacherAssignment {
  section: string;
  subject: string;
  department?: string;
  school: string;
}

// Response type for Register endpoint
interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    role: "student" | "teacher";
  };
}

// Response type for AdminRegister endpoint
interface AdminRegisterResponse {
  message: string;
}

// Response type for Login endpoint
interface LoginResponse {
  id: string;
  name: string;
  role: "admin" | "teacher" | "student";
  email: string;
  createdAt: string;
  status: "approved" | "pending" | "rejected" | "suspended";
  profilePic?: string;
  bio?: string;
}

// Response type for Logout endpoint
interface LogoutResponse {
  message: string;
}

// Response type for Approval endpoint
interface ApprovalResponse {
  message: string;
  user: User;
}

// Response type for TeacherResponsibilities endpoint
interface TeacherResponsibilitiesResponse {
  message: string;
  assignments: TeacherAssignment[];
}

// Response type for GetProfile endpoint
interface GetProfileResponse {
  // User object without password
  _id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
  status: "approved" | "pending" | "rejected" | "suspended";
  profilePic?: string;
  bio?: string;
  title?: string; // Admin-specific
  secAssigned?: TeacherAssignment[]; // Teacher-specific
  occupation?: string; // Teacher-specific
  batch?: string; // Student-specific
  section?: string; // Student-specific
  school?: string; // Student-specific
  department?: string; // Student-specific
  studentID?: string; // Student-specific
  createdAt?: string;
}

// Request payload for Register
interface RegisterRequest {
  name: string;
  email: string;
  studentID?: string; // Student-specific
  batch?: string; // Student-specific
  section?: string; // Student-specific
  school?: string; // Student-specific
  department?: string; // Student-specific
  occupation?: string; // Teacher-specific
  password: string;
  role: "student" | "teacher";
}

// Request payload for AdminRegister
interface AdminRegisterRequest {
  name: string;
  role: "admin";
  email: string;
  password: string;
  title: string;
}

// Request payload for Login
interface LoginRequest {
  email: string;
  password: string;
}

// Request payload for TeacherResponsibilities
interface TeacherResponsibilitiesRequest {
  assignments: TeacherAssignment[];
}

// Explicitly export types using 'export type'
export type {
  TeacherAssignment,
  RegisterResponse,
  AdminRegisterResponse,
  LoginResponse,
  LogoutResponse,
  ApprovalResponse,
  TeacherResponsibilitiesResponse,
  GetProfileResponse,
  RegisterRequest,
  AdminRegisterRequest,
  LoginRequest,
  TeacherResponsibilitiesRequest,
};
