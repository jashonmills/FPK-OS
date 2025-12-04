
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Accordion } from '@/components/ui/accordion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sparkles } from 'lucide-react';
import { type Flashcard } from '@/hooks/useFlashcards';
import FlashcardFolderItem from './FlashcardFolderItem';

interface FlashcardFolderViewProps {
  groupedFlashcards: Record<string, Flashcard[]>;
  selectedCards: Set<string>;
  expandedFolders: Set<string>;
  folderViewModes: Record<string, 'grid' | 'list'>;
  recentCardIds: string[];
  onToggleSelection: (cardId: string) => void;
  onToggleFolder: (folderId: string) => void;
  onToggleFolderViewMode: (folderId: string) => void;
  onSelectAllInFolder: (folderId: string) => void;
  onBulkFolderAction: (folderId: string, action: 'delete' | 'archive') => void;
  isCardRecent: (cardId: string) => boolean;
  folderHasRecentCards: (folderId: string) => boolean;
  getRecentCardCount: (folderId: string) => number;
}

const FlashcardFolderView: React.FC<FlashcardFolderViewProps> = ({
  groupedFlashcards,
  selectedCards,
  expandedFolders,
  folderViewModes,
  recentCardIds,
  onToggleSelection,
  onToggleFolder,
  onToggleFolderViewMode,
  onSelectAllInFolder,
  onBulkFolderAction,
  isCardRecent,
  folderHasRecentCards,
  getRecentCardCount,
}) => {
  const isMobile = useIsMobile();
  const totalFolders = Object.keys(groupedFlashcards).length;
  const totalCards = Object.values(groupedFlashcards).flat().length;
  const selectedCount = selectedCards.size;
  const expandedCount = expandedFolders.size;
  const totalRecentCards = recentCardIds.length;

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Summary Bar - Enhanced contrast */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 sm:p-4 lg:p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 text-xs">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Badge variant="outline" className="text-xs bg-white border-slate-300 text-slate-700 shadow-sm">{totalFolders} folders</Badge>
            <Badge variant="outline" className="text-xs bg-white border-slate-300 text-slate-700 shadow-sm">{totalCards} total cards</Badge>
          </div>
          {totalRecentCards > 0 && (
            <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-xs shadow-md">
              <Sparkles className="h-3 w-3 mr-1" />
              {totalRecentCards} new cards
            </Badge>
          )}
          {selectedCount > 0 && (
            <Badge variant="default" className="bg-blue-600 hover:bg-blue-700 text-xs shadow-md">
              {selectedCount} selected
            </Badge>
          )}
          {expandedCount > 0 && !isMobile && (
            <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-700 border border-gray-300 shadow-sm">
              {expandedCount} expanded
            </Badge>
          )}
        </div>
      </div>

      {/* Recent Cards Alert */}
      {totalRecentCards > 0 && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <Sparkles className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-green-800">
                🎉 {totalRecentCards} new flashcard{totalRecentCards > 1 ? 's' : ''} added!
              </h4>
              <p className="text-xs text-green-700 mt-1">
                Your recently approved cards are highlighted with a "NEW" badge below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Folders Accordion - Enhanced spacing and contrast */}
      <Accordion type="multiple" className="space-y-4 sm:space-y-5 lg:space-y-6">
        {Object.entries(groupedFlashcards).map(([folderId, cards]) => (
          <FlashcardFolderItem
            key={folderId}
            folderId={folderId}
            folderName={folderId}
            cards={cards}
            selectedCards={selectedCards}
            isExpanded={expandedFolders.has(folderId)}
            viewMode={folderViewModes[folderId] || 'grid'}
            hasRecentCards={folderHasRecentCards(folderId)}
            recentCardCount={getRecentCardCount(folderId)}
            onToggleSelection={onToggleSelection}
            onToggleFolder={onToggleFolder}
            onToggleViewMode={onToggleFolderViewMode}
            onSelectAllInFolder={onSelectAllInFolder}
            onBulkFolderAction={onBulkFolderAction}
            isCardRecent={isCardRecent}
          />
        ))}
      </Accordion>

      {/* Empty State - Enhanced styling */}
      {totalFolders === 0 && (
        <div className="text-center py-8 sm:py-12 lg:py-16 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-gray-400 mb-4">
            <div className="text-4xl sm:text-5xl lg:text-7xl mb-3 sm:mb-5">📁</div>
            <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-2 sm:mb-3">
              No flashcard folders found
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-3 sm:px-6">
              Create some flashcards to get started
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardFolderView;
