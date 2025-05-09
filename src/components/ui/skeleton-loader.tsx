
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonLoaderProps {
  variant?: "card" | "list" | "text" | "stats" | "profile";
  count?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = "card",
  count = 1,
  className = "",
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case "card":
        return (
          <div className={`space-y-3 ${className}`}>
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
        );
        
      case "list":
        return (
          <div className={`space-y-4 ${className}`}>
            {Array(count)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40 rounded" />
                    <Skeleton className="h-3 w-24 rounded" />
                  </div>
                </div>
              ))}
          </div>
        );
        
      case "stats":
        return (
          <div className={`grid grid-cols-2 gap-4 ${className}`}>
            {Array(count)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-20 rounded" />
                  <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
              ))}
          </div>
        );
        
      case "profile":
        return (
          <div className={`space-y-4 ${className}`}>
            <div className="flex justify-center">
              <Skeleton className="h-24 w-24 rounded-full" />
            </div>
            <Skeleton className="h-6 w-40 mx-auto rounded" />
            <Skeleton className="h-4 w-60 mx-auto rounded" />
            <div className="flex justify-center space-x-2 pt-2">
              <Skeleton className="h-10 w-20 rounded" />
              <Skeleton className="h-10 w-20 rounded" />
            </div>
          </div>
        );
      
      case "text":
      default:
        return (
          <div className={`space-y-2 ${className}`}>
            {Array(count)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-4 w-full rounded" />
              ))}
          </div>
        );
    }
  };

  return <>{renderSkeleton()}</>;
};

export { SkeletonLoader };
