
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
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Bar */}
      <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2 flex-wrap">
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
      <Accordion type="multiple" className="space-y-3 sm:space-y-4">
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
        <div className="text-center py-8 sm:py-12">
          <div className="text-gray-400 mb-4">
            <div className="text-4xl sm:text-6xl mb-4">📁</div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              No flashcard folders found
            </h3>
            <p className="text-sm sm:text-base text-gray-600 px-4">
              Create some flashcards to get started
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardFolderView;
