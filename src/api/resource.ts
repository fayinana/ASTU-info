import {
  type GetResourcesResponse,
  type GetResourceResponse,
  type ResourceCreationRequest,
  type ExitExamCreationRequest,
  type DeleteResourceResponse,
  type GetResourcesQuery,
  type ExitExamCreationResponse,
  type ResourceCreationResponse,
} from "./../types/resource";
import apiClient, { handleApiError } from "../lib/apiClient";

// Fetch all resources with query parameters
export const fetchResources = async (query: GetResourcesQuery) => {
  try {
    const response = await apiClient.get<GetResourcesResponse>(
      "/resources",
      query
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Fetch a single resource
export const fetchResource = async (id: string) => {
  try {
    const response = await apiClient.get<GetResourceResponse>(
      `/resources/${id}`
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Create a resource
export const createResource = async (data: ResourceCreationRequest) => {
  try {
    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("school", data.school);
    formData.append("department", data.department);
    if (data.course) formData.append("course", data.course);
    if (data.year) formData.append("year", data.year.toString());
    data.files.forEach((file, index) =>
      formData.append(`files[${index}]`, file)
    );

    const response = await apiClient.post<ResourceCreationResponse>(
      "/resources",
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

// Create an exit exam
export const createExitExam = async (data: ExitExamCreationRequest) => {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("school", data.school);
    formData.append("department", data.department);
    if (data.year) formData.append("year", data.year.toString());
    data.files.forEach((file, index) =>
      formData.append(`files[${index}]`, file)
    );

    const response = await apiClient.post<ExitExamCreationResponse>(
      "/exit-exams",
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

// Delete a resource
export const deleteResource = async (id: string) => {
  try {
    const response = await apiClient.delete<DeleteResourceResponse>(
      `/resources/${id}`
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
