type UserRole = "admin" | "teacher" | "student";
type PostType = "announcement" | "instructional" | "public";
type ResourceType = "resource" | "exitExam";
export const USER_ROLES: Record<UserRole, string> = {
  admin: "Administrator",
  teacher: "Teacher",
  student: "Student",
};

export const USER_ROLE_COLORS: Record<UserRole, string> = {
  admin: "#FF5733", // Red-orange
  teacher: "#33A1FD", // Blue
  student: "#28C76F", // Green
};

export const POST_TYPES: Record<PostType, string> = {
  announcement: "Announcement",
  instructional: "Instructional",
  public: "Public Discussion",
};

export const POST_TYPE_COLORS: Record<PostType, string> = {
  announcement: "#FF5733", // Red-orange
  instructional: "#33A1FD", // Blue
  public: "#28C76F", // Green
};

export const RESOURCE_TYPES: Record<ResourceType, string> = {
  exitExam: "Exit Exam",
  resource: "Resource",
};

export const RESOURCE_TYPE_COLORS: Record<ResourceType, string> = {
  exitExam: "#33A1FD", // Blue
  resource: "#28C76F", // Green
};

export const RESOURCE_TYPE_ICONS: Record<ResourceType, string> = {
  exitExam: "file-text",
  resource: "image",
};

// Validation patterns
export const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;
export const PASSWORD_MIN_LENGTH = 8;
export const ID_NUMBER_PATTERN = /^(ugr|pgr)\/\d{5}\/\d{2}$/;
