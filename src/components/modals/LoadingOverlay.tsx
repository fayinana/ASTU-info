
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  isLoading: boolean;
  children?: ReactNode;
  message?: string;
  className?: string;
}

export const LoadingOverlay = ({
  isLoading,
  children,
  message = "Processing...",
  className,
}: LoadingOverlayProps) => {
  if (!isLoading) return children;

  return (
    <div className="relative">
      {children && (
        <div className={cn("pointer-events-none opacity-50", className)}>
          {children}
        </div>
      )}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-lg font-medium text-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
};
