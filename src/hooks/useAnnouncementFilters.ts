import { useState, useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { debounce } from "lodash"; // Assuming lodash for debouncing
import { GetPostsQuery, GetPostsResponse } from "@/types/post"; // Adjust path to your types file
import ApiQuerySenderClass from "@/lib/apiQuery";

// Define class for ApiQuerySender
class ApiQuerySenderImpl {
  private params: URLSearchParams;

  constructor() {
    this.params = new URLSearchParams();
  }

  clearParams() {
    this.params = new URLSearchParams();
  }

  setParam(key: string, value: string) {
    this.params.set(key, value);
  }

  getQueryParams() {
    return new URLSearchParams(this.params.toString());
  }
}

type ApiQuerySender = InstanceType<typeof ApiQuerySenderImpl>;

// Filter state interface, aligned with GetPostsQuery
export interface FilterState {
  search: string;
  role: string;
  type: "announcement" | "instructional" | "public";
  page: number;
  limit: number;
}

// Pagination state interface, aligned with GetPostsResponse.pagination
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const defaultFilters: FilterState = {
  search: "",
  role: "",
  type: "instructional", // Default to "instructional" as per previous request
  page: 1,
  limit: 5,
};

const defaultPagination: PaginationState = {
  page: 1,
  limit: 5,
  total: 0,
  totalPages: 0,
};

export function useAnnouncementFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => {
    // Validate numeric parameters
    const page = Math.max(1, Number(searchParams.get("page")) || defaultFilters.page);
    const limit = Math.max(1, Number(searchParams.get("limit")) || defaultFilters.limit);
    // Validate type parameter
    const typeParam = searchParams.get("type");
    const validType = ["announcement", "instructional", "public"].includes(typeParam)
      ? (typeParam as FilterState["type"])
      : defaultFilters.type;
    return {
      search: searchParams.get("search") || defaultFilters.search,
      role: searchParams.get("role") || defaultFilters.role,
      type: validType,
      page,
      limit,
    };
  });

  const [pagination, setPagination] = useState<PaginationState>({
    page: filters.page,
    limit: filters.limit,
    total: 0,
    totalPages: 0,
  });

  // Memoize ApiQuerySender to prevent recreation
    const apiSender = useMemo(() => new ApiQuerySenderClass(), []);

  // Debounced function to update URL search params
  const updateSearchParams = useMemo(
    () =>
      debounce((filters: FilterState) => {
        apiSender.clearParams();
        if (filters.search) apiSender.setParam("search", filters.search);
        if (filters.role) apiSender.setParam("role", filters.role);
        if (filters.type) apiSender.setParam("type", filters.type);
        if (filters.page > 1) apiSender.setParam("page", filters.page.toString());
        if (filters.limit !== defaultFilters.limit)
          apiSender.setParam("limit", filters.limit.toString());
        setSearchParams(apiSender.getQueryParams());
      }, 300),
    [apiSender, setSearchParams]
  );

  // Sync filters with URL search parameters
  useEffect(() => {
    updateSearchParams(filters);
    return () => updateSearchParams.cancel(); // Cleanup debounce on unmount
  }, [filters, updateSearchParams]);

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => {
      const updated = {
        ...prev,
        ...newFilters,
        page: newFilters.page !== undefined ? Math.max(1, newFilters.page) : 1, // Reset to page 1 unless page is specified
      };
      // Reset pagination total when filters change (except page/limit)
      if (
        newFilters.search !== undefined ||
        newFilters.role !== undefined ||
        newFilters.type !== undefined
      ) {
        setPagination((prevPagination) => ({
          ...prevPagination,
          total: 0,
          totalPages: 0,
        }));
      }
      return updated;
    });
  }, []);

  const updatePagination = useCallback(
    (newPagination: Partial<PaginationState>) => {
      setPagination((prev) => ({
        ...prev,
        ...newPagination,
        page: Math.max(1, newPagination.page || prev.page),
        limit: Math.max(1, newPagination.limit || prev.limit),
      }));
      setFilters((prev) => ({
        ...prev,
        page: Math.max(1, newPagination.page || prev.page),
        limit: Math.max(1, newPagination.limit || prev.limit),
      }));
    },
    []
  );

  const getQuery = useCallback((): GetPostsQuery => {
    return {
      search: filters.search || undefined,
      role: filters.role || undefined,
      type: filters.type || undefined,
      page: filters.page,
      limit: filters.limit,
    };
  }, [filters]);

  return {
    filters,
    pagination,
    updateFilters,
    updatePagination,
    getQuery,
  };
}