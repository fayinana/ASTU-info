
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AvatarSkeleton } from "./AvatarSkeleton";
import { BadgeSkeleton } from "./BadgeSkeleton";

export const PostItemSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <AvatarSkeleton />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="ml-auto">
            <BadgeSkeleton />
          </div>
        </div>
        
        <Skeleton className="h-5 w-3/4 mb-2" />
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-3">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      </CardContent>
    </Card>
  );
};

export const PostListSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <PostItemSkeleton key={index} />
      ))}
    </div>
  );
};
