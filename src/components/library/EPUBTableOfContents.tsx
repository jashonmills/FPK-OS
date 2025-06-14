
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface EPUBTableOfContentsProps {
  isOpen: boolean;
  onClose: () => void;
  toc: any[];
  onItemClick: (href: string) => void;
  isNavigating?: boolean;
}

const EPUBTableOfContents: React.FC<EPUBTableOfContentsProps> = ({
  isOpen,
  onClose,
  toc,
  onItemClick,
  isNavigating = false
}) => {
  const handleTOCItemClick = (href: string) => {
    onItemClick(href);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Table of Contents
            {isNavigating && (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {toc.length > 0 ? (
            toc.map((item, index) => (
              <button
                key={index}
                onClick={() => handleTOCItemClick(item.href)}
                disabled={isNavigating}
                className="block w-full text-left p-2 hover:bg-muted rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-sm">{item.label}</span>
              </button>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No table of contents available for this book.
            </p>
          )}
        </div>
        {isNavigating && (
          <div className="text-center p-2">
            <p className="text-xs text-muted-foreground">Loading chapter...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EPUBTableOfContents;
