import { z } from "zod";
import {
  EMAIL_PATTERN,
  // USERNAME_PATTERN,
  PASSWORD_MIN_LENGTH,
  // ID_NUMBER_PATTERN,
} from "./constants";

// Login schema
export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .regex(EMAIL_PATTERN, "Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// Registration schema
export const registrationSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email address")
      .regex(EMAIL_PATTERN, "Invalid email format"),
    password: z
      .string()
      .min(
        PASSWORD_MIN_LENGTH,
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    name: z.string().min(1, "Name is required"),
    role: z.enum(["admin", "teacher", "student"], {
      required_error: "Please select a role",
    }),
    studentID: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .superRefine((data, ctx) => {
    if (data.role === "student" && !data.studentID) {
      ctx.addIssue({
        path: ["studentID"],
        code: z.ZodIssueCode.custom,
        message: "Student ID is required for students",
      });
    }

    if (data.role !== "student" && data.studentID) {
      ctx.addIssue({
        path: ["studentID"],
        code: z.ZodIssueCode.custom,
        message: "Student ID should not be filled unless you're a student",
      });
    }
  });

export type RegistrationFormValues = z.infer<typeof registrationSchema>;

// Post schema
export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  type: z.enum(["announcement", "instructional", "public"], {
    required_error: "Please select a post type",
  }),
  target_department: z.string().optional(),
  target_batch: z.string().optional(),
  target_section: z.string().optional(),
  target_school: z.string().optional(),
});

export type PostFormValues = z.infer<typeof postSchema>;

// Comment schema
export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment is too long"),
});

export type CommentFormValues = z.infer<typeof commentSchema>;

// Profile schema
export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  bio: z.string().optional(),
  department: z.string().optional(),
  school: z.string().optional(),
  batch: z.string().optional(),
  section: z.string().optional(),
  title: z.string().optional(),
  occupation: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

// Resource schema
export const resourceSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    type: z.enum(["document", "image", "video", "link"], {
      required_error: "Please select a resource type",
    }),
    description: z.string().optional(),
    department: z.string().optional(),
    year: z.string().optional(),
    file: z.instanceof(File).optional(),
    url: z.string().url("Please enter a valid URL").optional(),
  })
  .refine(
    (data) => {
      if (data.type === "link") {
        return !!data.url;
      }
      return !!data.file;
    },
    {
      message: "Please provide either a file or URL",
      path: ["file"],
    }
  );

export type ResourceFormValues = z.infer<typeof resourceSchema>;

// Message schema
export const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
});

export type MessageFormValues = z.infer<typeof messageSchema>;

export const announcementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, "File is required")
    .or(z.null()),
});

export type AnnouncementFormValues = z.infer<typeof announcementSchema>;
