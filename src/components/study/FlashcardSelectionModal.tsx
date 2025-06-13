
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFlashcards } from '@/hooks/useFlashcards';
import { analyzeFlashcardTopic } from '@/utils/flashcardTopicAnalyzer';
import { Brain } from 'lucide-react';
import type { Flashcard } from '@/hooks/useFlashcards';
import FlashcardSelectionHeader from './FlashcardSelectionHeader';
import FlashcardFolderList from './FlashcardFolderList';
import FlashcardIndividualList from './FlashcardIndividualList';

interface FlashcardSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedFlashcards: Flashcard[]) => void;
  studyMode: 'memory_test' | 'multiple_choice' | 'timed_challenge';
}

const FlashcardSelectionModal: React.FC<FlashcardSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  studyMode
}) => {
  const { flashcards } = useFlashcards();
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [selectedIndividualCards, setSelectedIndividualCards] = useState<string[]>([]);
  const [showIndividualCards, setShowIndividualCards] = useState(false);

  // Group flashcards by topic using the same logic as FlashcardManager
  const groupedFlashcards = React.useMemo(() => {
    const groups: Record<string, Flashcard[]> = {};
    
    flashcards.forEach(card => {
      // Use the topic analyzer to determine the appropriate folder
      const topicFolder = analyzeFlashcardTopic(
        card.front_content, 
        card.back_content, 
        card.note_id,
        card.created_at
      );
      
      if (!groups[topicFolder]) {
        groups[topicFolder] = [];
      }
      groups[topicFolder].push(card);
    });
    
    // Sort groups by name for consistent ordering
    const sortedGroups: Record<string, Flashcard[]> = {};
    Object.keys(groups)
      .sort()
      .forEach(key => {
        sortedGroups[key] = groups[key];
      });
    
    return sortedGroups;
  }, [flashcards]);

  const handleFolderToggle = (folderId: string) => {
    setSelectedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const handleSelectAll = () => {
    const allFolderIds = Object.keys(groupedFlashcards);
    setSelectedFolders(allFolderIds);
    setSelectedIndividualCards([]);
  };

  const handleIndividualCardToggle = (cardId: string) => {
    setSelectedIndividualCards(prev =>
      prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const getSelectedFlashcards = () => {
    if (showIndividualCards) {
      return flashcards.filter(card => selectedIndividualCards.includes(card.id));
    } else {
      const selectedCards: Flashcard[] = [];
      selectedFolders.forEach(folderId => {
        const folderCards = groupedFlashcards[folderId] || [];
        selectedCards.push(...folderCards);
      });
      return selectedCards;
    }
  };

  const selectedCards = getSelectedFlashcards();

  const handleConfirm = () => {
    if (selectedCards.length === 0) {
      alert('Please select at least one flashcard to study.');
      return;
    }
    onConfirm(selectedCards);
  };

  // Reset selections when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedFolders([]);
      setSelectedIndividualCards([]);
      setShowIndividualCards(false);
    }
  }, [isOpen]);

  const studyModeNames = {
    memory_test: 'Memory Test',
    multiple_choice: 'Multiple Choice',
    timed_challenge: 'Timed Challenge'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Select Flashcards for {studyModeNames[studyMode]}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden min-h-0">
          <FlashcardSelectionHeader
            showIndividualCards={showIndividualCards}
            onToggleView={setShowIndividualCards}
            onSelectAll={handleSelectAll}
            selectedCount={selectedCards.length}
          />

          <ScrollArea className="flex-1 h-[400px] pr-4">
            {!showIndividualCards ? (
              <FlashcardFolderList
                groupedFlashcards={groupedFlashcards}
                selectedFolders={selectedFolders}
                onFolderToggle={handleFolderToggle}
              />
            ) : (
              <FlashcardIndividualList
                flashcards={flashcards}
                selectedCards={selectedIndividualCards}
                onCardToggle={handleIndividualCardToggle}
              />
            )}
          </ScrollArea>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={selectedCards.length === 0}
          >
            Start Studying ({selectedCards.length} cards)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FlashcardSelectionModal;
