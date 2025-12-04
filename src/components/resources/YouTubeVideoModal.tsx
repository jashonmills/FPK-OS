import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface YouTubeVideoModalProps {
  videoId: string | null;
  title: string;
  onClose: () => void;
}

export function YouTubeVideoModal({ videoId, title, onClose }: YouTubeVideoModalProps) {
  return (
    <Dialog open={!!videoId} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl">{title}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full">
          {videoId && (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              className="w-full h-full rounded-b-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={title}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
