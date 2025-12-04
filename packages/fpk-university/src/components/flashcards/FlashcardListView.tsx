
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type Flashcard } from '@/hooks/useFlashcards';
import { FileText, BookOpen, Edit } from 'lucide-react';

interface FlashcardListViewProps {
  groupedFlashcards: Record<string, Flashcard[]>;
  selectedCards: Set<string>;
  onToggleSelection: (cardId: string) => void;
  onSelectAll: () => void;
}

const FlashcardListView: React.FC<FlashcardListViewProps> = ({
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

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="space-y-6">
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

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={cards.every(card => selectedCards.has(card.id))}
                        onCheckedChange={() => {
                          const allGroupSelected = cards.every(card => selectedCards.has(card.id));
                          cards.forEach(card => {
                            if (allGroupSelected && selectedCards.has(card.id)) {
                              onToggleSelection(card.id);
                            } else if (!allGroupSelected && !selectedCards.has(card.id)) {
                              onToggleSelection(card.id);
                            }
                          });
                        }}
                        className="h-4 w-4"
                      />
                    </TableHead>
                    <TableHead className="min-w-[200px]">Front Content</TableHead>
                    <TableHead className="min-w-[200px]">Back Content</TableHead>
                    <TableHead className="w-20">Level</TableHead>
                    <TableHead className="w-24">Reviews</TableHead>
                    <TableHead className="w-24">Success</TableHead>
                    <TableHead className="w-32">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cards.map((card) => (
                    <TableRow
                      key={card.id}
                      className={`cursor-pointer hover:bg-gray-50 ${
                        selectedCards.has(card.id) ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => onToggleSelection(card.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedCards.has(card.id)}
                          onCheckedChange={() => onToggleSelection(card.id)}
                          className="h-4 w-4"
                        />
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm text-gray-900 font-medium">
                          {truncateText(card.front_content, 60)}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {truncateText(card.back_content, 60)}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {card.difficulty_level}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {card.times_reviewed}
                        </span>
                      </TableCell>
                      
                      <TableCell>
                        {card.times_reviewed > 0 ? (
                          <Badge 
                            className={`text-xs ${getPerformanceColor(card)}`}
                            variant="secondary"
                          >
                            {Math.round((card.times_correct / card.times_reviewed) * 100)}%
                          </Badge>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-xs text-gray-500">
                          {new Date(card.created_at).toLocaleDateString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FlashcardListView;
