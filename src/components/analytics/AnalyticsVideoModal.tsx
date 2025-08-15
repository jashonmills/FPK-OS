import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface AnalyticsVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AnalyticsVideoModal({ isOpen, onClose }: AnalyticsVideoModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus the close button when modal opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[90vw] md:max-w-[70vw] p-0 gap-0"
        onClick={handleOverlayClick}
      >
        <DialogTitle className="sr-only">How to Use Analytics</DialogTitle>
        
        {/* Close button */}
        <Button
          ref={closeButtonRef}
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10 bg-background/80 hover:bg-background/90"
          onClick={onClose}
          aria-label="Close video"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Video container */}
        <div className="p-4">
          <AspectRatio ratio={16 / 9}>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/yfKauiMPEX0?si=5oon8ri4QN3EptAX"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="rounded-md"
            />
          </AspectRatio>
        </div>
      </DialogContent>
    </Dialog>
  );
}