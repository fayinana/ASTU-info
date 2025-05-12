
import { Skeleton } from "@/components/ui/skeleton";

interface ContentSkeletonProps {
  lines?: number;
  title?: boolean;
  subtitle?: boolean;
}

export const ContentSkeleton = ({
  lines = 5,
  title = true,
  subtitle = true
}: ContentSkeletonProps) => {
  return (
    <div className="space-y-4">
      {title && <Skeleton className="h-8 w-3/4 max-w-md mb-2" />}
      {subtitle && <Skeleton className="h-5 w-full max-w-lg mb-4" />}

      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className={`h-4 ${i % 2 === 0 ? 'w-full' : 'w-4/5'}`} />
        ))}
      </div>
    </div>
  );
};
