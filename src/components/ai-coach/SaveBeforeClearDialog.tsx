import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, Trash2 } from 'lucide-react';

interface SaveBeforeClearDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAndClear: (title?: string) => void;
  onClearWithoutSaving: () => void;
  messageCount: number;
  suggestedTitle?: string;
}

export const SaveBeforeClearDialog: React.FC<SaveBeforeClearDialogProps> = ({
  isOpen,
  onClose,
  onSaveAndClear,
  onClearWithoutSaving,
  messageCount,
  suggestedTitle = ''
}) => {
  const [customTitle, setCustomTitle] = useState(suggestedTitle);

  const handleSaveAndClear = () => {
    onSaveAndClear(customTitle.trim() || undefined);
    onClose();
  };

  const handleClearWithoutSaving = () => {
    onClearWithoutSaving();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5 text-primary" />
            Save Your Chat?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You have {messageCount} message{messageCount !== 1 ? 's' : ''} in this conversation. 
            Would you like to save it before clearing?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <Label htmlFor="chat-title" className="text-sm font-medium">
            Chat Title (optional)
          </Label>
          <Input
            id="chat-title"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder={suggestedTitle || "Enter a title for this chat..."}
            className="mt-2"
            maxLength={100}
          />
          <p className="text-xs text-muted-foreground mt-1">
            If left blank, we'll generate a title based on your conversation.
          </p>
        </div>

        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button
              variant="outline"
              onClick={handleClearWithoutSaving}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear Without Saving
            </Button>
            
            <div className="flex gap-2">
              <AlertDialogCancel asChild>
                <Button variant="ghost">Cancel</Button>
              </AlertDialogCancel>
              
              <AlertDialogAction asChild>
                <Button onClick={handleSaveAndClear} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save & Clear
                </Button>
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};