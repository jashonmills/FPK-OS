
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface EPUBTableOfContentsProps {
  isOpen: boolean;
  onClose: () => void;
  toc: any[];
  onItemClick: (href: string) => void;
}

const EPUBTableOfContents: React.FC<EPUBTableOfContentsProps> = ({
  isOpen,
  onClose,
  toc,
  onItemClick
}) => {
  const handleTOCItemClick = (href: string) => {
    onItemClick(href);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Table of Contents</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {toc.length > 0 ? (
            toc.map((item, index) => (
              <button
                key={index}
                onClick={() => handleTOCItemClick(item.href)}
                className="block w-full text-left p-2 hover:bg-muted rounded"
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
      </DialogContent>
    </Dialog>
  );
};

export default EPUBTableOfContents;
