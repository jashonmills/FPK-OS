
import React from 'react';

interface EPUBReaderContentProps {
  readerRef: React.RefObject<HTMLDivElement>;
  isNavigating: boolean;
  bookTitle: string;
  bookAuthor: string;
  forceLayoutRefresh: () => void;
  isLoading: boolean;
  error: any;
  isInitialized: boolean;
}

export const EPUBReaderContent: React.FC<EPUBReaderContentProps> = ({
  readerRef,
  isNavigating,
  bookTitle,
  bookAuthor,
  forceLayoutRefresh,
  isLoading,
  error,
  isInitialized
}) => {
  // Layout refresh when needed
  React.useEffect(() => {
    if (!isLoading && !error && !isNavigating && isInitialized) {
      const timer = setTimeout(() => {
        forceLayoutRefresh();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, error, isNavigating, forceLayoutRefresh, isInitialized]);

  return (
    <div className="flex-1 relative">
      <div
        ref={readerRef}
        className="w-full h-full bg-background overflow-auto"
        tabIndex={0}
        role="main"
        aria-label={`Reading ${bookTitle} by ${bookAuthor}`}
        style={{ 
          opacity: isNavigating ? 0.7 : 1,
          minHeight: '100%'
        }}
      />
      
      {isNavigating && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 pointer-events-none">
          <div className="bg-background border border-border rounded-lg p-4 flex items-center gap-2 shadow-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm">Loading chapter...</span>
          </div>
        </div>
      )}
    </div>
  );
};
