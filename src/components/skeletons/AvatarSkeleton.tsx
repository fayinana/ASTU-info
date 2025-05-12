
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type AvatarSkeletonSize = "xs" | "sm" | "md" | "lg";

interface AvatarSkeletonProps {
  size?: AvatarSkeletonSize;
  className?: string;
}

export const AvatarSkeleton = ({ size = "md", className }: AvatarSkeletonProps) => {
  const sizeClasses = {
    xs: "h-6 w-6",
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  return (
    <Skeleton
      className={cn("rounded-full", sizeClasses[size], className)}
    />
  );
};
