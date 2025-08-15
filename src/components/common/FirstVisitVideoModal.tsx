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
        className="helpModal max-w-[min(1100px,90vw)] w-full border-0 p-6 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.25)] max-h-[90vh] overflow-y-auto"
        onClick={handleOverlayClick}
      >
        <DialogHeader className="p-0 mb-4">
          <DialogTitle className="modalTitle flex items-center gap-2 text-xl font-semibold">
            <HelpCircle className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-0">
          {videoUrl ? (
            <div className="videoWrap mb-4">
              <iframe 
                src={videoUrl}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                onClick={handleVideoClick}
              />
            </div>
          ) : contentHtml ? (
            <div
              className="w-full"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
              onClick={handleVideoClick}
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}