/* eslint-disable @typescript-eslint/no-explicit-any */
interface Author {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
}

interface ResourceFile {
  type: string;
  url: string;
}

interface Resource {
  _id: string;
  authorId: Author | string;
  type: "resource" | "exitExam";
  title: string;
  description: string;
  school: string;
  department: string;
  year?: number;
  files: ResourceFile[];
  createdAt: string;
  updatedAt: string;
}

interface ResourceCreationResponse {
  message: string;
  resource: Resource;
}

interface ExitExamCreationResponse {
  message: string;
  exitExam: Resource;
}

interface GetResourcesResponse {
  status: "success";
  results: number;
  pagination: {
    total: number;
    limit: number;
    page: number;
    totalPages: number;
  };
  resources: Resource[];
}

interface GetResourceResponse {
  resource: Resource;
}

interface DeleteResourceResponse {
  message: string;
}

interface ResourceCreationRequest {
  type: "resource" | "exitExam";
  title: string;
  description: string;
  school: string;
  department: string;
  course?: string;
  year?: number;
  files: File[];
}

interface ExitExamCreationRequest {
  title: string;
  description: string;
  school: string;
  department: string;
  year?: number;
  files: File[];
}

interface GetResourcesQuery {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  fields?: string;
  [key: string]: any;
}

export type {
  Author,
  Resource,
  ResourceFile,
  ResourceCreationResponse,
  ExitExamCreationResponse,
  GetResourcesResponse,
  GetResourceResponse,
  DeleteResourceResponse,
  ResourceCreationRequest,
  ExitExamCreationRequest,
  GetResourcesQuery,
};
