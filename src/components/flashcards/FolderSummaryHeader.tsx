
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { type Flashcard } from '@/hooks/useFlashcards';
import { FileText, BookOpen, Edit, Trash2, Archive } from 'lucide-react';

interface FolderSummaryHeaderProps {
  folderName: string;
  cards: Flashcard[];
  selectedInFolder: number;
  allSelected: boolean;
  onSelectAllInFolder: () => void;
  onBulkFolderAction: (action: 'delete' | 'archive') => void;
}

const FolderSummaryHeader: React.FC<FolderSummaryHeaderProps> = ({
  folderName,
  cards,
  selectedInFolder,
  allSelected,
  onSelectAllInFolder,
  onBulkFolderAction,
}) => {
  const getSourceIcon = (folderName: string) => {
    if (folderName.includes('Manual')) return Edit;
    if (folderName.includes('Notes') || folderName.includes('note')) return BookOpen;
    return FileText;
  };

  const getSourceType = (folderName: string) => {
    if (folderName.includes('Manual')) return 'Manual';
    if (folderName.includes('Notes') || folderName.includes('note')) return 'Notes';
    return 'Upload';
  };

  const SourceIcon = getSourceIcon(folderName);
  const sourceType = getSourceType(folderName);
  const createdDate = cards.length > 0 ? new Date(cards[0].created_at).toLocaleDateString() : '';

  const handleSelectAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectAllInFolder();
  };

  const handleAction = (e: React.MouseEvent, action: 'delete' | 'archive') => {
    e.stopPropagation();
    onBulkFolderAction(action);
  };

  return (
    <div className="flex items-center justify-between w-full" onClick={(e) => e.stopPropagation()}>
      {/* Left Side - Folder Info */}
      <div className="flex items-center gap-4 flex-1">
        <Checkbox
          checked={allSelected}
          onCheckedChange={handleSelectAll}
          onClick={handleSelectAll}
          className="h-4 w-4"
        />
        
        <div className="flex items-center gap-3">
          <SourceIcon className="h-5 w-5 text-gray-500" />
          <div>
            <h3 className="font-semibold text-gray-900">{folderName}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{sourceType}</span>
              <span>•</span>
              <span>{createdDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Stats and Actions */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {cards.length} cards
          </Badge>
          {selectedInFolder > 0 && (
            <Badge variant="default" className="text-sm bg-blue-600">
              {selectedInFolder} selected
            </Badge>
          )}
        </div>

        {/* Folder Actions */}
        <div className="flex items-center gap-1">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => e.stopPropagation()}
                className="h-8 w-8 p-0 text-orange-600 hover:bg-orange-50"
              >
                <Archive className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Archive Folder</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to archive all {cards.length} cards in "{folderName}"? 
                  Archived cards will be hidden from study sessions.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => handleAction(e, 'archive')}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Archive Folder
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => e.stopPropagation()}
                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Folder</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to permanently delete all {cards.length} cards in "{folderName}"? 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => handleAction(e, 'delete')}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Folder
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default FolderSummaryHeader;
