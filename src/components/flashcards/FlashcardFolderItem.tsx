
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
      className="border border-gray-200 rounded-lg bg-white"
    >
      <AccordionTrigger 
        className="hover:no-underline px-6 py-4"
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
      
      <AccordionContent className="px-6 pb-6">
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
