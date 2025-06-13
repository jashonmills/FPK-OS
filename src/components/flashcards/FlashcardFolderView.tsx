
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Accordion } from '@/components/ui/accordion';
import { useIsMobile } from '@/hooks/use-mobile';
import { type Flashcard } from '@/hooks/useFlashcards';
import FlashcardFolderItem from './FlashcardFolderItem';

interface FlashcardFolderViewProps {
  groupedFlashcards: Record<string, Flashcard[]>;
  selectedCards: Set<string>;
  expandedFolders: Set<string>;
  folderViewModes: Record<string, 'grid' | 'list'>;
  onToggleSelection: (cardId: string) => void;
  onToggleFolder: (folderId: string) => void;
  onToggleFolderViewMode: (folderId: string) => void;
  onSelectAllInFolder: (folderId: string) => void;
  onBulkFolderAction: (folderId: string, action: 'delete' | 'archive') => void;
}

const FlashcardFolderView: React.FC<FlashcardFolderViewProps> = ({
  groupedFlashcards,
  selectedCards,
  expandedFolders,
  folderViewModes,
  onToggleSelection,
  onToggleFolder,
  onToggleFolderViewMode,
  onSelectAllInFolder,
  onBulkFolderAction,
}) => {
  const isMobile = useIsMobile();
  const totalFolders = Object.keys(groupedFlashcards).length;
  const totalCards = Object.values(groupedFlashcards).flat().length;
  const selectedCount = selectedCards.size;
  const expandedCount = expandedFolders.size;

  return (
    <div className="space-y-2 sm:space-y-3 lg:space-y-4">
      {/* Summary Bar */}
      <div className="bg-gray-50 rounded-lg p-2 sm:p-3 lg:p-4">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 lg:gap-4 text-xs">
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">{totalFolders} folders</Badge>
            <Badge variant="outline" className="text-xs">{totalCards} total cards</Badge>
          </div>
          {selectedCount > 0 && (
            <Badge variant="default" className="bg-blue-600 text-xs">
              {selectedCount} selected
            </Badge>
          )}
          {expandedCount > 0 && !isMobile && (
            <Badge variant="secondary" className="text-xs">
              {expandedCount} expanded
            </Badge>
          )}
        </div>
      </div>

      {/* Folders Accordion */}
      <Accordion type="multiple" className="space-y-2 sm:space-y-3">
        {Object.entries(groupedFlashcards).map(([folderId, cards]) => (
          <FlashcardFolderItem
            key={folderId}
            folderId={folderId}
            folderName={folderId}
            cards={cards}
            selectedCards={selectedCards}
            isExpanded={expandedFolders.has(folderId)}
            viewMode={folderViewModes[folderId] || 'grid'}
            onToggleSelection={onToggleSelection}
            onToggleFolder={onToggleFolder}
            onToggleViewMode={onToggleFolderViewMode}
            onSelectAllInFolder={onSelectAllInFolder}
            onBulkFolderAction={onBulkFolderAction}
          />
        ))}
      </Accordion>

      {/* Empty State */}
      {totalFolders === 0 && (
        <div className="text-center py-6 sm:py-8 lg:py-12">
          <div className="text-gray-400 mb-4">
            <div className="text-3xl sm:text-4xl lg:text-6xl mb-2 sm:mb-4">📁</div>
            <h3 className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
              No flashcard folders found
            </h3>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 px-2 sm:px-4">
              Create some flashcards to get started
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardFolderView;
