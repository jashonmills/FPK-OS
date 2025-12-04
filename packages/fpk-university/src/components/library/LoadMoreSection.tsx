
import React from 'react';
import { Button } from '@/components/ui/button';

interface LoadMoreSectionProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  booksCount: number;
  loadMoreAmount: number;
}

const LoadMoreSection: React.FC<LoadMoreSectionProps> = ({
  hasMore,
  isLoading,
  onLoadMore,
  booksCount,
  loadMoreAmount
}) => {
  if (!hasMore) return null;

  return (
    <div className="text-center">
      <Button 
        onClick={onLoadMore} 
        variant="outline" 
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            Loading more books...
          </>
        ) : (
          <>
            Load {loadMoreAmount} More Books
          </>
        )}
      </Button>
      <p className="text-xs text-muted-foreground mt-2">
        Showing {booksCount} books. Smart prefetching and instant search enabled.
      </p>
    </div>
  );
};

export default LoadMoreSection;
