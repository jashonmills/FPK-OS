
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';
import { Sparkles } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const { t, renderText, tString } = useGlobalTranslation('dashboard');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
            <Sparkles className="h-6 w-6 text-purple-600" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            {renderText(t('welcome.title'))}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {renderText(t('welcome.description'))}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <Button onClick={onClose} className="w-full">
            {renderText(t('welcome.getStarted'))}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
