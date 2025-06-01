import { Skeleton } from "@/components/ui/skeleton";

export const ChatListSkeleton = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-start gap-3 p-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-[120px] mb-2" />
              <Skeleton className="h-3 w-[40px]" />
            </div>
            <Skeleton className="h-3 w-[180px]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const MessagesSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[60%] rounded-2xl px-4 py-3 ${
              i % 2 === 0
                ? "bg-gray-200 dark:bg-gray-700 rounded-tr-none"
                : "bg-gray-100 dark:bg-gray-800 rounded-tl-none"
            }`}
          >
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-[70%]" />
              {i === 1 && <Skeleton className="h-20 w-full rounded-md mt-2" />}
            </div>
            <div className="flex justify-end mt-2">
              <Skeleton className="h-2 w-10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
