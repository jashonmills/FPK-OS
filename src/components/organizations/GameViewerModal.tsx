import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface GameViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameUrl: string;
  gameTitle: string;
}

export function GameViewerModal({ isOpen, onClose, gameUrl, gameTitle }: GameViewerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full p-0">
        <DialogHeader className="p-6 pb-4 flex flex-row items-center gap-3">
          <Button 
            variant="outline" 
            size="icon"
            onClick={onClose}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <DialogTitle className="text-2xl font-bold">{gameTitle}</DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-0">
          <div className="aspect-video w-full">
            <iframe
              src={gameUrl}
              title={gameTitle}
              className="w-full h-full rounded-lg border-0"
              allowFullScreen
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
