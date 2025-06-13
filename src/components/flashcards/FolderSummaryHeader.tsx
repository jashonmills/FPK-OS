
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { type Flashcard } from '@/hooks/useFlashcards';
import { FileText, BookOpen, Edit, Trash2, Archive, Brain, Upload, Folder, MoreVertical } from 'lucide-react';

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
  const isMobile = useIsMobile();
  
  const getSourceIcon = (folderName: string) => {
    // Topic-based icons
    if (folderName.includes('Goonies')) return FileText;
    if (folderName.includes('Learning State')) return Brain;
    if (folderName.includes('Dragon Fire')) return FileText;
    if (folderName.includes('Cannabis')) return FileText;
    if (folderName.includes('Photography')) return FileText;
    if (folderName.includes('Wellness')) return FileText;
    if (folderName.includes('Technology')) return FileText;
    if (folderName.includes('Science')) return FileText;
    if (folderName.includes('Business')) return FileText;
    if (folderName.includes('History')) return FileText;
    
    if (folderName.includes('Manual')) return Edit;
    if (folderName.includes('Notes') || folderName.includes('Study Notes')) return BookOpen;
    if (folderName.includes('Upload') || folderName.includes('Recent Upload')) return Upload;
    
    return Folder;
  };

  const getSourceType = (folderName: string) => {
    // Check if it's a topic-based folder
    const topicFolders = ['Goonies', 'Learning State', 'Dragon Fire', 'Cannabis', 'Photography', 
                         'Wellness', 'Technology', 'Science', 'Business', 'History'];
    
    for (const topic of topicFolders) {
      if (folderName.includes(topic)) {
        return 'Topic';
      }
    }
    
    if (folderName.includes('Manual')) return 'Manual';
    if (folderName.includes('Notes') || folderName.includes('Study Notes')) return 'Notes';
    if (folderName.includes('Upload') || folderName.includes('Recent Upload')) return 'Upload';
    
    return 'Auto-grouped';
  };

  const SourceIcon = getSourceIcon(folderName);
  const sourceType = getSourceType(folderName);
  const createdDate = cards.length > 0 ? new Date(cards[0].created_at).toLocaleDateString() : '';

  const handleSelectAll = () => {
    onSelectAllInFolder();
  };

  const handleAction = (e: React.MouseEvent, action: 'delete' | 'archive') => {
    e.stopPropagation();
    onBulkFolderAction(action);
  };

  return (
    <div className="flex items-center justify-between w-full" onClick={(e) => e.stopPropagation()}>
      {/* Left Side - Folder Info */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <Checkbox
          checked={allSelected}
          onCheckedChange={handleSelectAll}
          className="h-4 w-4 shrink-0"
        />
        
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <SourceIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 shrink-0" />
          <div className="min-w-0 flex-1">
            <h3 className="font-medium sm:font-semibold text-gray-900 text-sm sm:text-base truncate">
              {folderName}
            </h3>
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
              <span className="truncate">{sourceType}</span>
              {!isMobile && (
                <>
                  <span>•</span>
                  <span>{createdDate}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Stats and Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="flex items-center gap-1 sm:gap-2">
          <Badge variant="secondary" className="text-xs">
            {cards.length}
          </Badge>
          {selectedInFolder > 0 && (
            <Badge variant="default" className="text-xs bg-blue-600">
              {selectedInFolder}
            </Badge>
          )}
        </div>

        {/* Folder Actions */}
        {isMobile ? (
          <div className="flex items-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  className="h-8 w-8 p-0"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Folder Actions</AlertDialogTitle>
                  <AlertDialogDescription>
                    Choose an action for "{folderName}" ({cards.length} cards)
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex flex-col gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Archive className="h-4 w-4 mr-2" />
                        Archive Folder
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Archive Folder</AlertDialogTitle>
                        <AlertDialogDescription>
                          Archive all {cards.length} cards in "{folderName}"?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e) => handleAction(e, 'archive')}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          Archive
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Folder
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Folder</AlertDialogTitle>
                        <AlertDialogDescription>
                          Permanently delete all {cards.length} cards in "{folderName}"? This cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e) => handleAction(e, 'delete')}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default FolderSummaryHeader;
