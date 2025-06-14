
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/hooks/useAccessibility';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { PublicDomainBook } from '@/types/publicDomainBooks';

interface EPUBReaderContentProps {
  book: PublicDomainBook;
  isLoading: boolean;
  error: string | null;
  loadingStep: string;
  readerRef: React.RefObject<HTMLDivElement>;
  onRetry: () => void;
  onClose: () => void;
}

const EPUBReaderContent: React.FC<EPUBReaderContentProps> = ({
  book,
  isLoading,
  error,
  loadingStep,
  readerRef,
  onRetry,
  onClose
}) => {
  const { getAccessibilityClasses } = useAccessibility();

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
          <p className="text-xs text-muted-foreground">
            Please wait while we download and prepare your book...
          </p>
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
          <p className="text-sm text-muted-foreground mb-6">
            This could be due to network connectivity, server availability, or book file issues.
          </p>
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
    <div
      ref={readerRef}
      className={`w-full h-full ${getAccessibilityClasses('container')}`}
    />
  );
};

export default EPUBReaderContent;
