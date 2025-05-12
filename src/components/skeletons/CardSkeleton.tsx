
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CardSkeletonProps {
  hasHeader?: boolean;
  hasFooter?: boolean;
  lines?: number;
  className?: string;
}

export const CardSkeleton = ({
  hasHeader = true,
  hasFooter = false,
  lines = 3,
  className
}: CardSkeletonProps) => {
  return (
    <div className={cn("border rounded-lg p-6 space-y-4", className)}>
      {hasHeader && (
        <div className="space-y-2">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}
      
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className={`h-4 w-full ${i % 3 === 0 ? 'w-full' : i % 3 === 1 ? 'w-4/5' : 'w-2/3'}`} />
        ))}
      </div>
      
      {hasFooter && (
        <div className="flex justify-end pt-2">
          <Skeleton className="h-9 w-24" />
        </div>
      )}
    </div>
  );
};
