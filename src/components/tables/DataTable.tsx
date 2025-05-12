import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "../ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableActions } from "./TableActions";
import {
  SearchSkeleton,
  TableSkeleton,
} from "@/components/skeletons/TableSkeleton";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Search,
} from "lucide-react";
import FilterBar from "./FilterBar";

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string | ((row: T) => React.ReactNode);
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  value: string;
  columns: Column<T>[];
  data: T[] | undefined;
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  hideDelete?: (row: T) => boolean;
  additionalActions?: {
    label: string;
    onClick: (row: T) => void;
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
    className?: string;
  }[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  defaultSearchValue?: string;
  filters?: {
    name: string;
    label: string;
    options: { label: string; value: string }[];
    selectedValue?: string;
  }[];
  onFilter?: (field: string, value: string) => void;
  onClearFilters?: () => void;
}

export function DataTable<T>({
  value = "item", // Default value to prevent undefined errors
  columns,
  data = [],
  isLoading = false,
  onRowClick,
  onView,
  onEdit,
  onDelete,
  additionalActions,
  pagination,
  searchable = false,
  searchPlaceholder = "Search...",
  defaultSearchValue = "",
  onSearch,
  filters,
  onFilter,
  onClearFilters,
  hideDelete = () => false,
}: DataTableProps<T>) {
  const renderCellContent = (row: T, column: Column<T>) => {
    if (column.cell) {
      return column.cell(row);
    }

    if (typeof column.accessorKey === "function") {
      return column.accessorKey(row);
    }

    const key = column.accessorKey as string;
    const value = key.split(".").reduce((obj: any, path: string) => {
      return obj && obj[path] !== undefined ? obj[path] : undefined;
    }, row as any);

    return value !== undefined ? String(value) : "";
  };

  const hasActions = !!(onView || onEdit || onDelete || additionalActions);

  return (
    <div className="space-y-4">
      {searchable && (
        <FilterBar
          onSearch={onSearch}
          searchPlaceholder={searchPlaceholder}
          defaultSearchValue={defaultSearchValue}
          filters={filters}
          onFilter={onFilter}
          onClear={onClearFilters}
        />
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
              {hasActions && (
                <TableHead className="w-[160px] text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton
                columns={columns.length}
                rows={5}
                hasActions={hasActions}
              />
            ) : !data || data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={onRowClick ? "cursor-pointer hover:bg-muted" : ""}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className={column.className}>
                      {renderCellContent(row, column)}
                    </TableCell>
                  ))}

                  {hasActions && (
                    <TableCell className="text-right">
                      <TableActions
                        value={value}
                        onView={onView ? () => onView(row) : undefined}
                        onEdit={onEdit ? () => onEdit(row) : undefined}
                        onDelete={onDelete ? () => onDelete(row) : undefined}
                        hideDelete={hideDelete(row)}
                        additionalActions={
                          additionalActions
                            ? additionalActions.map((action) => ({
                                ...action,
                                onClick: () => action.onClick(row),
                              }))
                            : undefined
                        }
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <div className="flex items-center justify-between flex-wrap gap-4 py-4">
          <div className="text-sm text-muted-foreground">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.currentPage === 1}
              className={`${
                pagination.currentPage === 1 ? "cursor-not-allowed" : ""
              }`}
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                pagination.onPageChange(pagination.currentPage - 1)
              }
              disabled={pagination.currentPage === 1}
              className={`${
                pagination.currentPage === 1 ? "cursor-not-allowed" : ""
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === pagination.totalPages ||
                  Math.abs(page - pagination.currentPage) <= 1
              )
              .map((page, index, array) => {
                const prevPage = array[index - 1];
                const showDots = prevPage && page - prevPage > 1;
                return (
                  <React.Fragment key={page}>
                    {showDots && <span className="px-1">...</span>}
                    <Button
                      size="sm"
                      variant={
                        page === pagination.currentPage ? "default" : "outline"
                      }
                      onClick={() => pagination.onPageChange(page)}
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                );
              })}

            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                pagination.onPageChange(pagination.currentPage + 1)
              }
              disabled={pagination.currentPage === pagination.totalPages}
              className={`${
                pagination.currentPage === pagination.totalPages
                  ? "cursor-not-allowed"
                  : ""
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => pagination.onPageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
              className={`${
                pagination.currentPage === pagination.totalPages
                  ? "cursor-not-allowed"
                  : ""
              }`}
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
