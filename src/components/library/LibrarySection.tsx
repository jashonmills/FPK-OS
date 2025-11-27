
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface LibrarySectionProps {
  title: string;
  count: number;
  disabled?: boolean;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const LibrarySection: React.FC<LibrarySectionProps> = ({ 
  title, 
  count, 
  disabled = false, 
  children, 
  defaultOpen = false 
}) => {
  return (
    <details
      className="mb-6 border rounded-lg bg-card shadow-sm"
      open={!disabled && defaultOpen}
      onToggle={(e) => {
        if (disabled) {
          e.preventDefault();
          (e.target as HTMLDetailsElement).open = false;
        }
      }}
    >
      <summary
        className={`
          flex items-center justify-between p-4 text-lg font-semibold transition-colors
          ${disabled 
            ? 'opacity-60 cursor-not-allowed bg-muted/30' 
            : 'cursor-pointer hover:bg-muted/50'
          }
        `}
      >
        <span className="flex items-center gap-2">
          {title} ({count})
        </span>
        <div className="flex items-center space-x-2">
          {disabled && (
            <Badge variant="outline" className="text-xs">
              Coming Soon
            </Badge>
          )}
          {!disabled && (
            <ChevronDown className="h-4 w-4 transition-transform [details[open]_&]:rotate-180" />
          )}
        </div>
      </summary>

      {!disabled && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </details>
  );
};

export default LibrarySection;
