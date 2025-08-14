import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X, HelpCircle } from 'lucide-react';

interface AICoachVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AICoachVideoModal({ isOpen, onClose }: AICoachVideoModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Close modal when clicking on the overlay (outside the video)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    // Prevent modal from closing when clicking on the video itself
    e.stopPropagation();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[90vw] md:max-w-[70vw] p-0 bg-background/95 backdrop-blur-sm border-border"
        onClick={handleOverlayClick}
      >
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <HelpCircle className="h-5 w-5 text-primary" />
            How to Use AI Study Coach
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Close video guide"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>
        
        <div className="px-6 pb-6">
          <div 
            className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden"
            onClick={handleVideoClick}
          >
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/aNq0jxs98U0?si=-BYqBZ8-yf3lv7ow" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Learn how to make the most of your AI Study Coach features and personalized learning experience.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}