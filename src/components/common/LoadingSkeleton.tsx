/**
 * Reusable loading skeleton component
 */

import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  variant?: 'card' | 'text' | 'avatar' | 'button' | 'chart';
  className?: string;
  lines?: number;
}

export const LoadingSkeleton = ({ 
  variant = 'card', 
  className, 
  lines = 3 
}: LoadingSkeletonProps) => {
  const baseClasses = "animate-pulse bg-muted rounded";
  
  if (variant === 'text') {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i}
            className={cn(
              baseClasses,
              "h-4",
              i === lines - 1 ? "w-3/4" : "w-full"
            )}
          />
        ))}
      </div>
    );
  }

  if (variant === 'avatar') {
    return (
      <div className={cn(baseClasses, "w-10 h-10 rounded-full", className)} />
    );
  }

  if (variant === 'button') {
    return (
      <div className={cn(baseClasses, "h-10 w-24", className)} />
    );
  }

  if (variant === 'chart') {
    return (
      <div className={cn("space-y-3", className)}>
        <div className={cn(baseClasses, "h-4 w-1/2")} />
        <div className={cn(baseClasses, "h-32 w-full")} />
      </div>
    );
  }

  // Default card variant
  return (
    <div className={cn("p-4 space-y-3", className)}>
      <div className={cn(baseClasses, "h-6 w-3/4")} />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i}
            className={cn(
              baseClasses,
              "h-4",
              i === lines - 1 ? "w-2/3" : "w-full"
            )}
          />
        ))}
      </div>
    </div>
  );
};