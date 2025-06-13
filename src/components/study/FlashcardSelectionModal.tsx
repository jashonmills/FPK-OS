
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useFlashcardSets } from '@/hooks/useFlashcardSets';
import { Folder, FileText, Brain, Users } from 'lucide-react';
import type { Flashcard } from '@/hooks/useFlashcards';

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
  const { sets } = useFlashcardSets();
  const [selectedSets, setSelectedSets] = useState<string[]>([]);
  const [selectedIndividualCards, setSelectedIndividualCards] = useState<string[]>([]);
  const [showIndividualCards, setShowIndividualCards] = useState(false);

  // Group flashcards by set or create default groups
  const flashcardGroups = React.useMemo(() => {
    const groups = new Map<string, { name: string; cards: Flashcard[]; type: string; icon: React.ComponentType<any> }>();
    
    // Add flashcards to their respective sets
    sets.forEach(set => {
      const setCards = flashcards.filter(card => card.set_id === set.id);
      if (setCards.length > 0) {
        groups.set(set.id, {
          name: set.name,
          cards: setCards,
          type: set.source_type,
          icon: set.source_type === 'upload' ? FileText : set.source_type === 'notes' ? Brain : Folder
        });
      }
    });

    // Add ungrouped flashcards
    const ungroupedCards = flashcards.filter(card => !card.set_id);
    if (ungroupedCards.length > 0) {
      groups.set('ungrouped', {
        name: 'Ungrouped Cards',
        cards: ungroupedCards,
        type: 'manual',
        icon: Brain
      });
    }

    return Array.from(groups.entries()).map(([id, group]) => ({ id, ...group }));
  }, [flashcards, sets]);

  const handleSetToggle = (setId: string) => {
    setSelectedSets(prev => 
      prev.includes(setId) 
        ? prev.filter(id => id !== setId)
        : [...prev, setId]
    );
  };

  const handleSelectAll = () => {
    const allSetIds = flashcardGroups.map(group => group.id);
    setSelectedSets(allSetIds);
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
      selectedSets.forEach(setId => {
        const group = flashcardGroups.find(g => g.id === setId);
        if (group) {
          selectedCards.push(...group.cards);
        }
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
      setSelectedSets([]);
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
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Select Flashcards for {studyModeNames[studyMode]}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="space-y-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button 
                  variant={!showIndividualCards ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowIndividualCards(false)}
                >
                  <Folder className="h-4 w-4 mr-1" />
                  By Sets
                </Button>
                <Button 
                  variant={showIndividualCards ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowIndividualCards(true)}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Individual Cards
                </Button>
              </div>
              
              {!showIndividualCards && (
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  <Users className="h-4 w-4 mr-1" />
                  Select All Sets
                </Button>
              )}
            </div>

            <div className="text-sm text-gray-600">
              Selected: <Badge variant="secondary">{selectedCards.length} cards</Badge>
            </div>
          </div>

          <ScrollArea className="flex-1 max-h-96">
            {!showIndividualCards ? (
              <div className="space-y-2">
                {flashcardGroups.map((group) => (
                  <div key={group.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      checked={selectedSets.includes(group.id)}
                      onCheckedChange={() => handleSetToggle(group.id)}
                    />
                    <group.icon className="h-4 w-4 text-gray-500" />
                    <div className="flex-1">
                      <div className="font-medium">{group.name}</div>
                      <div className="text-sm text-gray-500">
                        {group.cards.length} cards • {group.type}
                      </div>
                    </div>
                    <Badge variant="outline">{group.cards.length}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {flashcards.map((card) => (
                  <div key={card.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      checked={selectedIndividualCards.includes(card.id)}
                      onCheckedChange={() => handleIndividualCardToggle(card.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{card.front_content}</div>
                      <div className="text-xs text-gray-500 truncate mt-1">{card.back_content}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">Level {card.difficulty_level}</Badge>
                        {card.times_reviewed > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {Math.round((card.times_correct / card.times_reviewed) * 100)}% correct
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
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
