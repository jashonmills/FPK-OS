
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SaveToNotesButtonProps {
  onClick: () => void;
  className?: string;
  hasSelection?: boolean;
}

const SaveToNotesButton: React.FC<SaveToNotesButtonProps> = ({
  onClick,
  className,
  hasSelection = false
}) => {
  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={onClick}
      className={cn(
        "h-6 w-6 sm:h-7 sm:w-7 opacity-0 group-hover:opacity-100 transition-opacity touch-target",
        "focus:opacity-100 focus:ring-2 focus:ring-purple-500 focus:ring-offset-1",
        "md:opacity-0 md:group-hover:opacity-100", // Hide on desktop unless hover
        "sm:opacity-100", // Always visible on mobile
        hasSelection && "opacity-100 bg-purple-100 hover:bg-purple-200",
        className
      )}
      title={hasSelection ? "Save selected text to Notes" : "Save this message to Notes"}
      aria-label={hasSelection ? "Save selected text to Notes" : "Save this message to Notes"}
    >
      <Save className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
    </Button>
  );
};

export default SaveToNotesButton;
