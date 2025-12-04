
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NavItem } from 'epubjs';
import { BookOpen, Loader2 } from 'lucide-react';

interface EPUBTableOfContentsProps {
  isOpen: boolean;
  onClose: () => void;
  toc: NavItem[];
  onItemClick: (item: NavItem) => void;
  isNavigating: boolean;
}

const EPUBTableOfContents: React.FC<EPUBTableOfContentsProps> = ({
  isOpen,
  onClose,
  toc,
  onItemClick,
  isNavigating
}) => {
  const handleItemClick = (item: NavItem) => {
    onItemClick(item);
    onClose();
  };

  const renderTOCItem = (item: NavItem, level: number = 0) => {
    return (
      <div key={item.id || item.href} className={`ml-${level * 4}`}>
        <Button
          variant="ghost"
          className="w-full justify-start text-left h-auto py-2 px-3"
          onClick={() => handleItemClick(item)}
          disabled={isNavigating}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{item.label}</span>
            {isNavigating && <Loader2 className="h-3 w-3 animate-spin ml-auto" />}
          </div>
        </Button>
        {item.subitems && item.subitems.map(subitem => 
          renderTOCItem(subitem, level + 1)
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Table of Contents</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-96">
          {toc.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No table of contents available</p>
            </div>
          ) : (
            <div className="space-y-1">
              {toc.map(item => renderTOCItem(item))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EPUBTableOfContents;
