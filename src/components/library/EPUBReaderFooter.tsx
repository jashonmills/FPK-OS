
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home, Book } from 'lucide-react';

interface EPUBReaderFooterProps {
  onClose: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  currentLocation?: string;
}

const EPUBReaderFooter: React.FC<EPUBReaderFooterProps> = ({
  onClose,
  onPrevPage,
  onNextPage,
  currentLocation
}) => {
  return (
    <div className="flex-shrink-0 p-4 border-t bg-background">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Library</span>
        </Button>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onPrevPage} className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          
          {currentLocation && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-muted rounded text-sm text-muted-foreground">
              <Book className="h-3 w-3" />
              Reading...
            </div>
          )}
          
          <Button variant="outline" onClick={onNextPage} className="flex items-center gap-1">
            <span className="hidden sm:inline">Next</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="mt-2 text-center">
        <p className="text-xs text-muted-foreground">
          Use arrow keys or swipe to navigate • Press ESC to close
        </p>
      </div>
    </div>
  );
};

export default EPUBReaderFooter;
