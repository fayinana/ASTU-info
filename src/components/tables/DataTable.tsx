import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TableActions } from "./TableActions";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import FilterBar from "./FilterBar";
import ApiQuerySender from "@/lib/apiQuery";
// import ApiQuerySender from "./ApiQuerySender";

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
  defaultSearchValue?: string;
  filters?: {
    name: string;
    label: string;
    options: { label: string; value: string }[];
    selectedValue?: string;
  }[];
  querySender: ApiQuerySender; // Add ApiQuerySender as a prop
}

export function DataTable<T>({
  value = "item",
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
  filters,
  hideDelete = () => false,
  querySender,
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

  // Handle search updates
  const handleSearch = (query: string) => {
    querySender.setParam("search", query);
  };

  // Handle filter updates
  const handleFilter = (field: string, value: string) => {
    if (value) {
      querySender.setParam(field, value);
    } else {
      querySender.removeParam(field);
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    querySender.clearParams();
    if (pagination) {
      querySender.setParam("page", "1"); // Reset to first page
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    querySender.setParam("page", page.toString());
    pagination?.onPageChange(page);
  };

  return (
    <div className="space-y-4">
      {searchable && (
        <FilterBar
          onSearch={handleSearch}
          searchPlaceholder={searchPlaceholder}
          defaultSearchValue={defaultSearchValue}
          filters={filters}
          onFilter={handleFilter}
          onClear={handleClearFilters}
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
                              label:
  typeof action.label === "function"
    ? action.label(row)
    : action.label,
className:
  typeof action.className === "function"
    ? action.className(row)
    : action.className,

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
              onClick={() => handlePageChange(1)}
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
              onClick={() => handlePageChange(pagination.currentPage - 1)}
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
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                );
              })}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
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
              onClick={() => handlePageChange(pagination.totalPages)}
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
