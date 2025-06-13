
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
  onToggleSelection: (cardId: string) => void;
  onToggleFolder: (folderId: string) => void;
  onToggleViewMode: (folderId: string) => void;
  onSelectAllInFolder: (folderId: string) => void;
  onBulkFolderAction: (folderId: string, action: 'delete' | 'archive') => void;
}

const FlashcardFolderItem: React.FC<FlashcardFolderItemProps> = ({
  folderId,
  folderName,
  cards,
  selectedCards,
  isExpanded,
  viewMode,
  onToggleSelection,
  onToggleFolder,
  onToggleViewMode,
  onSelectAllInFolder,
  onBulkFolderAction,
}) => {
  const selectedInFolder = cards.filter(card => selectedCards.has(card.id)).length;
  const allSelected = selectedInFolder === cards.length && cards.length > 0;

  return (
    <AccordionItem 
      value={folderId} 
      className="border-2 border-slate-300 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-200"
    >
      <AccordionTrigger 
        className="hover:no-underline px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 bg-gradient-to-r from-white to-slate-50 rounded-t-xl border-b border-slate-200"
        onClick={() => onToggleFolder(folderId)}
      >
        <FolderSummaryHeader
          folderName={folderName}
          cards={cards}
          selectedInFolder={selectedInFolder}
          allSelected={allSelected}
          onSelectAllInFolder={() => onSelectAllInFolder(folderId)}
          onBulkFolderAction={(action) => onBulkFolderAction(folderId, action)}
        />
      </AccordionTrigger>
      
      <AccordionContent className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 bg-slate-50 rounded-b-xl">
        <FolderContentArea
          folderId={folderId}
          cards={cards}
          selectedCards={selectedCards}
          viewMode={viewMode}
          onToggleSelection={onToggleSelection}
          onToggleViewMode={onToggleViewMode}
        />
      </AccordionContent>
    </AccordionItem>
  );
};

export default FlashcardFolderItem;
