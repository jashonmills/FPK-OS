import { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ChoosePlanVideoModalProps {
  open: boolean;
  onClose: () => void;
}

export function ChoosePlanVideoModal({ open, onClose }: ChoosePlanVideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [open, onClose]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleVideoError = () => {
    console.error('Failed to load Choose Plan instructional video');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[90vw] md:max-w-[70vw] w-full p-0 gap-0 bg-background/95 backdrop-blur-sm border border-border/50"
        onPointerDownOutside={onClose}
        aria-describedby="choose-plan-video-description"
      >
        <div className="relative">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background/90 rounded-full"
            onClick={onClose}
            aria-label="Close video guide"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Hidden title for accessibility */}
          <DialogTitle className="sr-only">
            Choose Plan Page - How It Works Video Guide
          </DialogTitle>

          {/* Video container */}
          <div className="relative w-full">
            <video
              ref={videoRef}
              controls
              autoPlay
              muted
              className="w-full h-auto rounded-lg"
              style={{ maxHeight: '80vh' }}
              onError={handleVideoError}
              aria-describedby="choose-plan-video-description"
            >
              <source
                src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/video%20guide/Coupon%20Code%20Walk%20Through%20Video.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Video description for accessibility */}
          <div id="choose-plan-video-description" className="sr-only">
            Instructional video explaining how to use the Choose Plan page, including coupon codes and plan selection.
          </div>

          {/* Fallback message */}
          <div className="p-4 text-center text-sm text-muted-foreground">
            <p>Having trouble with the video? Make sure your browser supports HTML5 video playback.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}