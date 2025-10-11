import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface GameViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameUrl: string;
  gameTitle: string;
}

export function GameViewerModal({ isOpen, onClose, gameUrl, gameTitle }: GameViewerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">{gameTitle}</DialogTitle>
        </DialogHeader>
        <div className="w-full h-[calc(100%-80px)] p-6 pt-4">
          <iframe
            src={gameUrl}
            title={gameTitle}
            className="w-full h-full rounded-lg border-0"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
