
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface BadgeSkeletonProps {
  className?: string;
}

export const BadgeSkeleton = ({ className }: BadgeSkeletonProps) => {
  return (
    <Skeleton
      className={cn("h-5 w-16 rounded-full", className)}
    />
  );
};
