import { User as AppUser } from "@/types/user";
import { User as ApiUser } from "@/types/user";
import { Post as ApiPost } from "@/types/post";
import { Post as AppPost } from "@/types/post";

/**
 * Type adapters to convert between API types and application types
 * This helps us handle the differences between types defined in types/ and lib/
 */

export function adaptApiUserToAppUser(apiUser: ApiUser): AppUser {
  return {
    id: apiUser._id,
    username: apiUser.email.split("@")[0], // Use email prefix as username
    email: apiUser.email,
    name: apiUser.name,
    avatar: apiUser.profilePic,
    role: apiUser.role,
    department: apiUser.department,
    bio: apiUser.bio,
    title: apiUser.title,
    occupation: apiUser.occupation,
    batch: apiUser.batch,
    section: apiUser.section,
    school: apiUser.school,
    createdAt: apiUser.createdAt
      ? new Date(apiUser.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: apiUser.updatedAt
      ? new Date(apiUser.updatedAt).toISOString()
      : new Date().toISOString(),
    isApproved: apiUser.isApproved,
  };
}

export function adaptAppUserToApiUser(appUser: AppUser): ApiUser {
  return {
    _id: appUser.id,
    name: appUser.name,
    email: appUser.email,
    role: appUser.role,
    isApproved: appUser.isApproved,
    profilePic: appUser.avatar,
    bio: appUser.bio,
    title: appUser.title,
    occupation: appUser.occupation,
    batch: appUser.batch,
    section: appUser.section,
    school: appUser.school,
    department: appUser.department,
    createdAt: appUser.createdAt ? new Date(appUser.createdAt) : new Date(),
    updatedAt: appUser.updatedAt ? new Date(appUser.updatedAt) : new Date(),
  };
}

export function adaptApiPostToAppPost(apiPost: ApiPost): AppPost {
  return {
    id: apiPost._id,
    title: apiPost.title || "",
    content: apiPost.content || "",
    authorId:
      typeof apiPost.author === "string" ? apiPost.author : apiPost.author._id,
    author:
      typeof apiPost.author === "string"
        ? ({
            id: apiPost.author,
            name: "Unknown",
            email: "",
            username: "unknown",
            role: "student",
            isApproved: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as AppUser)
        : adaptApiUserToAppUser(apiPost.author),
    type: apiPost.type,
    createdAt: apiPost.createdAt
      ? new Date(apiPost.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    target_batch: apiPost.target?.batch,
    target_section: apiPost.target?.section,
    target_school: apiPost.target?.school,
    target_department: apiPost.target?.department,
    likes:
      (apiPost.like?.map((like) =>
        typeof like === "string"
          ? {
              id: like,
              postId: apiPost._id,
              userId: "",
              user: {} as AppUser,
              createdAt: new Date().toISOString(),
            }
          : {
              id: like._id,
              postId: apiPost._id,
              userId: like.author || "",
              user: {} as AppUser,
              createdAt: new Date(like.createdAt || new Date()).toISOString(),
            }
      ) as Like[]) || [],
    comments:
      (apiPost.comments?.map((comment) => ({
        id: comment._id || "",
        postId: apiPost._id,
        userId:
          typeof comment.author === "string"
            ? comment.author
            : comment.author._id,
        user:
          typeof comment.author === "string"
            ? ({
                id: comment.author,
                name: "Unknown",
                email: "",
                username: "unknown",
                role: "student",
                isApproved: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              } as AppUser)
            : adaptApiUserToAppUser(comment.author),
        content: comment.text,
        createdAt: comment.createdAt
          ? new Date(comment.createdAt).toISOString()
          : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })) as Comment[]) || [],
  };
}

export function adaptAppPostToApiPost(appPost: AppPost): ApiPost {
  return {
    _id: appPost.id,
    author: adaptAppUserToApiUser(appPost.author),
    type: appPost.type,
    content: appPost.content,
    title: appPost.title,
    target: {
      batch: appPost.target_batch,
      section: appPost.target_section,
      school: appPost.target_school,
      department: appPost.target_department,
    },
    like: appPost.likes?.map((like) => like.id) || [],
    comments:
      appPost.comments?.map((comment) => ({
        _id: comment.id,
        author: adaptAppUserToApiUser(comment.user),
        text: comment.content,
        email: comment.user.email,
        createdAt: new Date(comment.createdAt),
      })) || [],
    createdAt: new Date(appPost.createdAt),
  };
}
