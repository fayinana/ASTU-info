
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
  hasActions?: boolean;
}

export const TableRowSkeleton = ({
  columns,
  hasActions = true,
}: Pick<TableSkeletonProps, "columns" | "hasActions">) => {
  const actualColumns = hasActions ? columns + 1 : columns;

  return (
    <TableRow>
      {Array.from({ length: actualColumns }).map((_, index) => (
        <TableCell key={index}>
          <Skeleton
            className={index === 0 ? "h-7 w-48" : "h-7 w-full max-w-24"}
          />
        </TableCell>
      ))}
    </TableRow>
  );
};

export const SearchSkeleton = () => {
  return (
    <div className="flex space-x-2">
      <Skeleton className="h-10 w-64 rounded-md" />
      <Skeleton className="h-10 w-20 rounded-md" />
    </div>
  );
};

export const TableSkeleton = ({
  columns = 5,
  rows = 5,
  hasActions = true,
}: TableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRowSkeleton
          key={index}
          columns={columns}
          hasActions={hasActions}
        />
      ))}
    </>
  );
};
