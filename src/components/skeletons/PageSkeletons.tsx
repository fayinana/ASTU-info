
import { CardSkeleton } from "./CardSkeleton";
import { ContentSkeleton } from "./ContentSkeleton";
import { StatsRowSkeleton } from "./StatCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

// App Layout skeleton with sidebar and content
export const AppLayoutSkeleton = () => {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar skeleton */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r bg-card">
          <div className="flex items-center h-16 px-4 border-b">
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="flex-1 px-3 py-4 space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 md:pl-64">
        <div className="sticky top-0 z-10 flex-shrink-0 h-16 bg-background flex items-center border-b px-4 md:px-6">
          <Skeleton className="h-8 w-64" />
        </div>

        <main className="flex-1 p-4 md:p-6">
          <div className="mb-4">
            <Skeleton className="h-5 w-64 mb-6" />
          </div>
          <ContentSkeleton />
        </main>
      </div>
    </div>
  );
};

// Posts list page skeleton
export const PostsPageSkeleton = () => {
  return (
    <div className="space-y-6">
      <ContentSkeleton lines={2} subtitle={false} />
      
      <StatsRowSkeleton count={4} />
      
      <div className="border rounded-lg overflow-hidden">
        <div className="p-4 border-b bg-muted/40">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        
        <div className="p-4">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <CardSkeleton key={i} hasHeader={false} lines={2} className="border-0 p-4" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Students list page skeleton
export const StudentsPageSkeleton = () => {
  return (
    <div className="space-y-6">
      <ContentSkeleton lines={2} subtitle={false} />
      
      <StatsRowSkeleton count={3} />
      
      <div className="bg-muted/40 p-4 rounded-lg border">
        <div className="flex flex-col md:flex-row gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2 flex-1">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="flex mb-4">
            <Skeleton className="h-10 w-64 mr-2" />
            <Skeleton className="h-10 w-24" />
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="grid grid-cols-5 gap-4 border-b py-3 px-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
              
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="grid grid-cols-5 gap-4 border-b py-4 px-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Resources page skeleton
export const ResourcesPageSkeleton = () => {
  return (
    <div className="space-y-6">
      <ContentSkeleton lines={2} subtitle={false} />
      
      <div className="border rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        
        <div className="p-4">
          <div className="flex space-x-2 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-28" />
            ))}
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="grid grid-cols-4 gap-4 border-b py-3 px-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
              
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="grid grid-cols-4 gap-4 border-b py-4 px-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
