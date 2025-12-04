
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home, Book, Loader2, Clock } from 'lucide-react';

interface ReadingProgress {
  completion_percentage: number;
  reading_time_seconds: number;
  last_read_at: string;
}

interface EPUBReaderFooterProps {
  onClose: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  currentLocation?: string;
  isNavigating?: boolean;
  readingProgress?: ReadingProgress | null;
}

const EPUBReaderFooter: React.FC<EPUBReaderFooterProps> = ({
  onClose,
  onPrevPage,
  onNextPage,
  currentLocation,
  isNavigating = false,
  readingProgress
}) => {
  const formatLastRead = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex-shrink-0 p-4 border-t bg-background">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Library</span>
        </Button>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={onPrevPage} 
            disabled={isNavigating}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-muted rounded text-sm text-muted-foreground">
            {isNavigating ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Book className="h-3 w-3" />
                {readingProgress && (
                  <span>{readingProgress.completion_percentage.toFixed(1)}% • </span>
                )}
                Reading...
              </>
            )}
          </div>
          
          <Button 
            variant="outline" 
            onClick={onNextPage} 
            disabled={isNavigating}
            className="flex items-center gap-1"
          >
            <span className="hidden sm:inline">Next</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <p>Use arrow keys or swipe to navigate • Press ESC to close</p>
        {readingProgress?.last_read_at && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Last read {formatLastRead(readingProgress.last_read_at)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EPUBReaderFooter;
