import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { HelpCircle } from 'lucide-react';

interface FirstVisitVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoUrl?: string;
  contentHtml?: string;
}

export function FirstVisitVideoModal({ isOpen, onClose, title, videoUrl, contentHtml }: FirstVisitVideoModalProps) {
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
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6 pb-6">
          <div 
            className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden"
            onClick={handleVideoClick}
          >
            {videoUrl ? (
              <iframe 
                width="100%" 
                height="100%" 
                src={videoUrl}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            ) : contentHtml ? (
              <div
                className="absolute inset-0 w-full h-full"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            ) : null}
          </div>
          
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Learn how to make the most of this page's features and enhance your learning experience.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}