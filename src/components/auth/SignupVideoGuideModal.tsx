import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SignupVideoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignupVideoGuideModal: React.FC<SignupVideoGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[90%] md:max-w-[70%] w-full p-0 bg-background border-border"
        onClick={(e) => {
          // Prevent closing when clicking on the video
          if ((e.target as HTMLElement).closest('iframe')) {
            e.stopPropagation();
          }
        }}
      >
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-foreground">
              How This Page Works
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 rounded-full hover:bg-muted"
              aria-label="Close video guide"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            Watch this quick guide to understand how to use the signup page.
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 pb-6">
          <div className="relative w-full bg-muted rounded-lg" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg border-0"
              src="https://www.youtube-nocookie.com/embed/YDGjZksEYmg?si=5IODoTpqFSXj8OS2&rel=0&modestbranding=1"
              title="How This Page Works - Video Guide"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};