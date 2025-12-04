
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAccessibility } from '@/hooks/useAccessibility';
import { List, Minus, Plus, X, Clock, BookOpen } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ReadingProgress {
  completion_percentage: number;
  reading_time_seconds: number;
  last_read_at: string;
}

interface EPUBReaderHeaderProps {
  title: string;
  isLoading: boolean;
  error: string | null;
  fontSize: number;
  readingProgress?: ReadingProgress | null;
  onClose: () => void;
  onShowTOC: () => void;
  onFontSizeChange: (delta: number) => void;
}

const EPUBReaderHeader: React.FC<EPUBReaderHeaderProps> = ({
  title,
  isLoading,
  error,
  fontSize,
  readingProgress,
  onClose,
  onShowTOC,
  onFontSizeChange
}) => {
  const { getAccessibilityClasses } = useAccessibility();

  const formatReadingTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <DialogHeader className="flex-shrink-0 p-4 border-b">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <DialogTitle className={`text-lg truncate ${getAccessibilityClasses('text')}`}>
            {title}
          </DialogTitle>
          
          {/* Reading Progress Bar */}
          {readingProgress && !isLoading && !error && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  <span>{readingProgress.completion_percentage.toFixed(1)}% complete</span>
                </div>
                {readingProgress.reading_time_seconds > 0 && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatReadingTime(readingProgress.reading_time_seconds)}</span>
                  </div>
                )}
              </div>
              <Progress 
                value={readingProgress.completion_percentage} 
                className="h-1.5 bg-muted"
              />
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          {!isLoading && !error && (
            <>
              <Button variant="ghost" size="sm" onClick={onShowTOC}>
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onFontSizeChange(-2)}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm px-2">{fontSize}px</span>
              <Button variant="ghost" size="sm" onClick={() => onFontSizeChange(2)}>
                <Plus className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </DialogHeader>
  );
};

export default EPUBReaderHeader;
