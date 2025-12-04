
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Folder, FileText, Brain, Edit, Upload, BookOpen } from 'lucide-react';
import type { Flashcard } from '@/hooks/useFlashcards';

interface FlashcardFolderListProps {
  groupedFlashcards: Record<string, Flashcard[]>;
  selectedFolders: string[];
  onFolderToggle: (folderId: string) => void;
}

const FlashcardFolderList: React.FC<FlashcardFolderListProps> = ({
  groupedFlashcards,
  selectedFolders,
  onFolderToggle
}) => {
  const getFolderIcon = (folderName: string) => {
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
    
    // Source-based icons
    if (folderName.includes('Manual')) return Edit;
    if (folderName.includes('Notes') || folderName.includes('Study Notes')) return BookOpen;
    if (folderName.includes('Upload') || folderName.includes('Recent Upload')) return Upload;
    
    return Folder;
  };

  const getFolderType = (folderName: string) => {
    // Check if it's a topic-based folder
    const topicFolders = ['Goonies', 'Learning State', 'Dragon Fire', 'Cannabis', 'Photography', 
                         'Wellness', 'Technology', 'Science', 'Business', 'History'];
    
    for (const topic of topicFolders) {
      if (folderName.includes(topic)) {
        return 'Topic';
      }
    }
    
    // Source-based categorization
    if (folderName.includes('Manual')) return 'Manual';
    if (folderName.includes('Notes') || folderName.includes('Study Notes')) return 'Notes';
    if (folderName.includes('Upload') || folderName.includes('Recent Upload')) return 'Upload';
    
    return 'Auto-grouped';
  };

  return (
    <div className="space-y-2 pb-4">
      {Object.entries(groupedFlashcards).map(([folderId, folderCards]) => {
        const FolderIcon = getFolderIcon(folderId);
        const folderType = getFolderType(folderId);
        
        return (
          <div key={folderId} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
            <Checkbox
              checked={selectedFolders.includes(folderId)}
              onCheckedChange={() => onFolderToggle(folderId)}
            />
            <FolderIcon className="h-4 w-4 text-gray-500" />
            <div className="flex-1">
              <div className="font-medium">{folderId}</div>
              <div className="text-sm text-gray-500">
                {folderCards.length} cards • {folderType}
              </div>
            </div>
            <Badge variant="outline">{folderCards.length}</Badge>
          </div>
        );
      })}
    </div>
  );
};

export default FlashcardFolderList;
