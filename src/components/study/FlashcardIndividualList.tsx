
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import type { Flashcard } from '@/hooks/useFlashcards';

interface FlashcardIndividualListProps {
  flashcards: Flashcard[];
  selectedCards: string[];
  onCardToggle: (cardId: string) => void;
}

const FlashcardIndividualList: React.FC<FlashcardIndividualListProps> = ({
  flashcards,
  selectedCards,
  onCardToggle
}) => {
  return (
    <div className="space-y-2 pb-4">
      {flashcards.map((card) => (
        <div key={card.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
          <Checkbox
            checked={selectedCards.includes(card.id)}
            onCheckedChange={() => onCardToggle(card.id)}
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
  );
};

export default FlashcardIndividualList;
