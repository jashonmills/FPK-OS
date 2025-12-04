
import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { type Flashcard } from '@/hooks/useFlashcards';
import FolderSummaryHeader from './FolderSummaryHeader';
import FolderContentArea from './FolderContentArea';

interface FlashcardFolderItemProps {
  folderId: string;
  folderName: string;
  cards: Flashcard[];
  selectedCards: Set<string>;
  isExpanded: boolean;
  viewMode: 'grid' | 'list';
  hasRecentCards: boolean;
  recentCardCount: number;
  onToggleSelection: (cardId: string) => void;
  onToggleFolder: (folderId: string) => void;
  onToggleViewMode: (folderId: string) => void;
  onSelectAllInFolder: (folderId: string) => void;
  onBulkFolderAction: (folderId: string, action: 'delete' | 'archive') => void;
  isCardRecent: (cardId: string) => boolean;
}

const FlashcardFolderItem: React.FC<FlashcardFolderItemProps> = ({
  folderId,
  folderName,
  cards,
  selectedCards,
  isExpanded,
  viewMode,
  hasRecentCards,
  recentCardCount,
  onToggleSelection,
  onToggleFolder,
  onToggleViewMode,
  onSelectAllInFolder,
  onBulkFolderAction,
  isCardRecent,
}) => {
  const selectedInFolder = cards.filter(card => selectedCards.has(card.id)).length;
  const allSelected = selectedInFolder === cards.length && cards.length > 0;

  // Apply different styling for folders with recent cards
  const folderBorderClass = hasRecentCards 
    ? "border-2 border-green-300 bg-gradient-to-r from-green-50 to-white shadow-lg hover:shadow-xl" 
    : "border-2 border-slate-300 bg-white shadow-lg hover:shadow-xl";

  const headerBgClass = hasRecentCards
    ? "bg-gradient-to-r from-green-50 to-white border-b border-green-200"
    : "bg-gradient-to-r from-white to-slate-50 border-b border-slate-200";

  const contentBgClass = hasRecentCards
    ? "bg-green-25"
    : "bg-slate-50";

  return (
    <AccordionItem 
      value={folderId} 
      className={`${folderBorderClass} rounded-xl transition-all duration-200`}
    >
      <AccordionTrigger 
        className={`hover:no-underline px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 ${headerBgClass} rounded-t-xl`}
        onClick={() => onToggleFolder(folderId)}
      >
        <FolderSummaryHeader
          folderName={folderName}
          cards={cards}
          selectedInFolder={selectedInFolder}
          allSelected={allSelected}
          hasRecentCards={hasRecentCards}
          recentCardCount={recentCardCount}
          onSelectAllInFolder={() => onSelectAllInFolder(folderId)}
          onBulkFolderAction={(action) => onBulkFolderAction(folderId, action)}
        />
      </AccordionTrigger>
      
      <AccordionContent className={`px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 ${contentBgClass} rounded-b-xl`}>
        <FolderContentArea
          folderId={folderId}
          cards={cards}
          selectedCards={selectedCards}
          viewMode={viewMode}
          onToggleSelection={onToggleSelection}
          onToggleViewMode={onToggleViewMode}
          isCardRecent={isCardRecent}
        />
      </AccordionContent>
    </AccordionItem>
  );
};

export default FlashcardFolderItem;
