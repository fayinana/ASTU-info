import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ApiQuerySender from "@/lib/apiQuery";

export interface FilterState {
  search: string;
  role: string;
  type: string;
  page: number;
  limit: number;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const defaultFilters: FilterState = {
  search: "",
  role: "",
  type: "announcement",
  page: 1,
  limit: 5,
};

export function useAnnouncementFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => {
    return {
      search: searchParams.get("search") || defaultFilters.search,
      role: searchParams.get("role") || defaultFilters.role,
      type: searchParams.get("type") || defaultFilters.type,
      page: Number(searchParams.get("page")) || defaultFilters.page,
      limit: Number(searchParams.get("limit")) || defaultFilters.limit,
    };
  });

  const [pagination, setPagination] = useState<PaginationState>({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 5,
    total: 0,
    totalPages: 0,
  });

  // Sync filters with URL search parameters
  useEffect(() => {
    const apiSender = new ApiQuerySender();
    apiSender.clearParams();

    if (filters.search) apiSender.setParam("search", filters.search);
    if (filters.role) apiSender.setParam("role", filters.role);
    if (filters.type) apiSender.setParam("type", filters.type);
    if (filters.page > 1) apiSender.setParam("page", filters.page.toString());
    if (filters.limit !== 5)
      apiSender.setParam("limit", filters.limit.toString());

    setSearchParams(apiSender.getQueryParams());
  }, [filters, setSearchParams]);

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to page 1 when filters change
    }));
  }, []);

  const updatePagination = useCallback(
    (newPagination: Partial<PaginationState>) => {
      setPagination((prev) => ({
        ...prev,
        ...newPagination,
      }));
      setFilters((prev) => ({
        ...prev,
        page: newPagination.page || prev.page,
        limit: newPagination.limit || prev.limit,
      }));
    },
    []
  );

  const getQuery = useCallback((): FilterState => {
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
