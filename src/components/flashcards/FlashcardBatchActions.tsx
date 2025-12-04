
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { Trash2, Archive, X, Download, MoreHorizontal } from 'lucide-react';

interface FlashcardBatchActionsProps {
  selectedCount: number;
  onBulkDelete: () => Promise<void>;
  onBulkArchive: () => Promise<void>;
  onClearSelection: () => void;
}

const FlashcardBatchActions: React.FC<FlashcardBatchActionsProps> = ({
  selectedCount,
  onBulkDelete,
  onBulkArchive,
  onClearSelection
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const isMobile = useIsMobile();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onBulkDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleArchive = async () => {
    setIsArchiving(true);
    try {
      await onBulkArchive();
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        {/* Selection Info */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Badge variant="default" className="bg-blue-600 text-xs sm:text-sm">
            {selectedCount} selected
          </Badge>
          <span className="text-xs sm:text-sm text-blue-800">
            {isMobile ? 'Actions' : 'Bulk actions available'}
          </span>
        </div>

        {/* Actions */}
        {isMobile ? (
          <div className="flex flex-col gap-2">
            {/* Archive */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isArchiving}
                  className="w-full justify-start border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  <Archive className="h-4 w-4 mr-2" />
                  {isArchiving ? 'Archiving...' : `Archive ${selectedCount} card${selectedCount > 1 ? 's' : ''}`}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Archive Selected Flashcards</AlertDialogTitle>
                  <AlertDialogDescription>
                    Archive {selectedCount} flashcard{selectedCount > 1 ? 's' : ''}? 
                    Archived cards will be hidden from study sessions but can be restored later.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleArchive}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Archive
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Delete */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isDeleting}
                  className="w-full justify-start border-red-300 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? 'Deleting...' : `Delete ${selectedCount} card${selectedCount > 1 ? 's' : ''}`}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Selected Flashcards</AlertDialogTitle>
                  <AlertDialogDescription>
                    Permanently delete {selectedCount} flashcard{selectedCount > 1 ? 's' : ''}? 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Clear Selection */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="w-full justify-start text-gray-600 hover:text-gray-900"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Selection
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* Archive */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isArchiving}
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  <Archive className="h-4 w-4 mr-2" />
                  {isArchiving ? 'Archiving...' : 'Archive'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Archive Selected Flashcards</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to archive {selectedCount} flashcard{selectedCount > 1 ? 's' : ''}? 
                    Archived cards will be hidden from study sessions but can be restored later.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleArchive}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Archive {selectedCount} card{selectedCount > 1 ? 's' : ''}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Delete */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isDeleting}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Selected Flashcards</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to permanently delete {selectedCount} flashcard{selectedCount > 1 ? 's' : ''}? 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete {selectedCount} card{selectedCount > 1 ? 's' : ''}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Clear Selection */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardBatchActions;
