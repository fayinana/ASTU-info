/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
} from "axios";

export const baseURL =
  import.meta.env.VITE_API_BASE_URL || "https://gibi-ssvh.onrender.com/api";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🛡️ Enhanced response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const serverError = error.response.data as { message?: string };
      error.message = serverError?.message || error.message;
    } else if (error.request) {
      error.message = "Network error - no response from server";
    }
    return Promise.reject(error);
  }
);

// 📦 Generic request handler with enhanced types
export const request = async <T = any>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return api.request<T>({
    method,
    url,
    data,
    ...config,
  });
};

// 🌐 Export clean API methods with enhanced typing
export const apiClient = {
  get: <T = any>(url: string, params?: object, config?: AxiosRequestConfig) =>
    request<T>("get", url, undefined, { ...config, params }),

  post: <T = any>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>("post", url, data, config),

  put: <T = any>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>("put", url, data, config),

  patch: <T = any>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>("patch", url, data, config),

  delete: <T = any>(
    url: string,
    params?: object,
    config?: AxiosRequestConfig
  ) => request<T>("delete", url, undefined, { ...config, params }),
};

// Define common API response structure to handle wrapped data
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  totalPages?: number;
  currentPage?: number;
  totalResults?: number;
}

export default apiClient;

// 🛡️ Enhanced error handler
export const handleApiError = (error: unknown): never => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.error || error.message;
    throw new Error(message);
  }
  throw new Error("An unexpected error occurred");
};
