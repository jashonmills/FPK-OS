
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { type Flashcard } from '@/hooks/useFlashcards';
import { FileText, BookOpen, Edit } from 'lucide-react';

interface FlashcardGridViewProps {
  groupedFlashcards: Record<string, Flashcard[]>;
  selectedCards: Set<string>;
  onToggleSelection: (cardId: string) => void;
  onSelectAll: () => void;
}

const FlashcardGridView: React.FC<FlashcardGridViewProps> = ({
  groupedFlashcards,
  selectedCards,
  onToggleSelection,
  onSelectAll
}) => {
  const totalCards = Object.values(groupedFlashcards).flat().length;
  const allSelected = totalCards > 0 && selectedCards.size === totalCards;

  const getSourceIcon = (groupName: string) => {
    if (groupName.includes('Manual')) return Edit;
    if (groupName.includes('Notes') || groupName.includes('note')) return BookOpen;
    return FileText;
  };

  const getPerformanceColor = (card: Flashcard) => {
    if (card.times_reviewed === 0) return 'bg-gray-100 text-gray-600';
    const successRate = (card.times_correct / card.times_reviewed) * 100;
    if (successRate >= 80) return 'bg-green-100 text-green-700';
    if (successRate >= 50) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="space-y-6">
      {/* Select All */}
      {totalCards > 0 && (
        <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
          <Checkbox
            checked={allSelected}
            onCheckedChange={onSelectAll}
            className="h-4 w-4"
          />
          <span className="text-sm font-medium">
            Select All ({totalCards} cards)
          </span>
        </div>
      )}

      {/* Groups */}
      {Object.entries(groupedFlashcards).map(([groupName, cards]) => {
        const SourceIcon = getSourceIcon(groupName);
        
        return (
          <div key={groupName} className="space-y-4">
            {/* Group Header */}
            <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
              <SourceIcon className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900">{groupName}</h3>
              <Badge variant="secondary" className="text-xs">
                {cards.length} cards
              </Badge>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`relative bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                    selectedCards.has(card.id) ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-200'
                  }`}
                  onClick={() => onToggleSelection(card.id)}
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-3 right-3">
                    <Checkbox
                      checked={selectedCards.has(card.id)}
                      onCheckedChange={() => onToggleSelection(card.id)}
                      className="h-4 w-4"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Card Content */}
                  <div className="space-y-3 pr-6">
                    {/* Front */}
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                        Front
                      </div>
                      <div className="text-sm text-gray-900 line-clamp-3 leading-relaxed">
                        {card.front_content}
                      </div>
                    </div>

                    {/* Back */}
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                        Back
                      </div>
                      <div className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {card.back_content}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                      <Badge variant="outline" className="text-xs">
                        Level {card.difficulty_level}
                      </Badge>
                      
                      {card.times_reviewed > 0 && (
                        <Badge 
                          className={`text-xs ${getPerformanceColor(card)}`}
                          variant="secondary"
                        >
                          {Math.round((card.times_correct / card.times_reviewed) * 100)}%
                        </Badge>
                      )}
                      
                      <span className="text-xs text-gray-500">
                        {card.times_reviewed} reviews
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FlashcardGridView;
