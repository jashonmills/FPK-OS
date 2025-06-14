
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/hooks/useAccessibility';
import { AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import { Progress } from '@/components/ui/progress';

interface EPUBReaderContentProps {
  book: PublicDomainBook;
  isLoading: boolean;
  error: string | null;
  loadingStep: string;
  loadingProgress?: number;
  readerRef: React.RefObject<HTMLDivElement>;
  onRetry: () => void;
  onClose: () => void;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  isNavigating?: boolean;
}

const EPUBReaderContent: React.FC<EPUBReaderContentProps> = ({
  book,
  isLoading,
  error,
  loadingStep,
  loadingProgress = 0,
  readerRef,
  onRetry,
  onClose,
  onPrevPage,
  onNextPage,
  isNavigating = false
}) => {
  const { getAccessibilityClasses } = useAccessibility();

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isLoading || error || isNavigating) return;
      
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          onPrevPage?.();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          event.preventDefault();
          onNextPage?.();
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
      }
    };

    if (!isLoading && !error) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isLoading, error, isNavigating, onPrevPage, onNextPage, onClose]);

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-background">
        <div className="text-center max-w-md p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-6"></div>
          <h3 className={`text-lg font-semibold mb-2 ${getAccessibilityClasses('text')}`}>
            Loading "{book.title}"
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {loadingStep}
          </p>
          
          {loadingProgress > 0 && (
            <div className="mb-4">
              <Progress value={loadingProgress} className="w-full h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {loadingProgress}% complete
              </p>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            Please wait while we download and prepare your book...
          </p>
          
          {loadingStep.includes('Retrying') && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-xs">
                Having trouble connecting? We're automatically retrying with different settings.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-background">
        <div className="text-center max-w-lg p-6">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-6" />
          <h3 className="text-xl font-semibold mb-4">Unable to Load Book</h3>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <p className="text-destructive text-sm">{error}</p>
          </div>
          
          <div className="mb-6 space-y-2">
            <p className="text-sm font-medium">Troubleshooting Tips:</p>
            <ul className="text-xs text-muted-foreground space-y-1 text-left">
              <li>• Check your internet connection</li>
              <li>• Try refreshing the page</li>
              <li>• The book server might be temporarily busy</li>
              <li>• Some books may have large file sizes that take time to download</li>
            </ul>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button onClick={onClose}>
              Back to Library
            </Button>
          </div>
          <div className="mt-6 p-3 bg-muted rounded text-xs text-muted-foreground">
            <p><strong>Book:</strong> {book.title}</p>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Gutenberg ID:</strong> #{book.gutenberg_id}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Navigation overlay when navigating */}
      {isNavigating && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
          <div className="bg-background border border-border rounded-lg p-4 flex items-center gap-2 shadow-lg">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-sm">Loading chapter...</span>
          </div>
        </div>
      )}
      
      {/* Reader container */}
      <div
        ref={readerRef}
        className={`w-full h-full ${getAccessibilityClasses('container')} ${isNavigating ? 'pointer-events-none' : ''}`}
        tabIndex={0}
        role="main"
        aria-label={`Reading ${book.title} by ${book.author}`}
        style={{ opacity: isNavigating ? 0.7 : 1 }}
      />
    </div>
  );
};

export default EPUBReaderContent;
