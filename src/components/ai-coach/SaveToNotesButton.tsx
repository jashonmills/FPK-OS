
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Loader2 } from 'lucide-react';
import SaveToNotesDialog from './SaveToNotesDialog';

interface SaveToNotesButtonProps {
  content: string;
  selectedText?: string;
  originalQuestion?: string;
  aiMode?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const SaveToNotesButton: React.FC<SaveToNotesButtonProps> = ({
  content,
  selectedText,
  originalQuestion,
  aiMode,
  variant = 'outline',
  size = 'sm',
  className = ''
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleOpenDialog}
        className={`gap-2 ${className}`}
        title="Save this AI response to your notes"
      >
        <BookOpen className="h-4 w-4" />
        Save to Notes
      </Button>

      <SaveToNotesDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        content={content}
        selectedText={selectedText}
        originalQuestion={originalQuestion}
        aiMode={aiMode}
      />
    </>
  );
};

export default SaveToNotesButton;
