
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAccessibility } from '@/hooks/useAccessibility';
import { List, Minus, Plus, X } from 'lucide-react';

interface EPUBReaderHeaderProps {
  title: string;
  isLoading: boolean;
  error: string | null;
  fontSize: number;
  onClose: () => void;
  onShowTOC: () => void;
  onFontSizeChange: (delta: number) => void;
}

const EPUBReaderHeader: React.FC<EPUBReaderHeaderProps> = ({
  title,
  isLoading,
  error,
  fontSize,
  onClose,
  onShowTOC,
  onFontSizeChange
}) => {
  const { getAccessibilityClasses } = useAccessibility();

  return (
    <DialogHeader className="flex-shrink-0 p-4 border-b">
      <div className="flex items-center justify-between">
        <DialogTitle className={`text-lg ${getAccessibilityClasses('text')}`}>
          {title}
        </DialogTitle>
        <div className="flex items-center gap-2">
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
