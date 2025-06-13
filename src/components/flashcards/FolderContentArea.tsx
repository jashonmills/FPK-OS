
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type Flashcard } from '@/hooks/useFlashcards';
import { Grid, List } from 'lucide-react';

interface FolderContentAreaProps {
  folderId: string;
  cards: Flashcard[];
  selectedCards: Set<string>;
  viewMode: 'grid' | 'list';
  onToggleSelection: (cardId: string) => void;
  onToggleViewMode: (folderId: string) => void;
}

const FolderContentArea: React.FC<FolderContentAreaProps> = ({
  folderId,
  cards,
  selectedCards,
  viewMode,
  onToggleSelection,
  onToggleViewMode,
}) => {
  const getPerformanceColor = (card: Flashcard) => {
    if (card.times_reviewed === 0) return 'bg-gray-100 text-gray-600';
    const successRate = (card.times_correct / card.times_reviewed) * 100;
    if (successRate >= 80) return 'bg-green-100 text-green-700';
    if (successRate >= 50) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const truncateText = (text: string, maxLength: number = 40) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      {/* View Toggle */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-2 sm:pt-3">
        <div className="text-xs sm:text-sm text-gray-600">
          {cards.length} cards in this folder
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToggleViewMode(folderId)}
            className="flex items-center gap-1 h-6 px-2 text-xs"
          >
            <Grid className="h-3 w-3" />
            <span className="hidden sm:inline">Grid</span>
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToggleViewMode(folderId)}
            className="flex items-center gap-1 h-6 px-2 text-xs"
          >
            <List className="h-3 w-3" />
            <span className="hidden sm:inline">List</span>
          </Button>
        </div>
      </div>

      {/* Cards Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`relative bg-gray-50 border rounded-lg p-2 sm:p-3 hover:shadow-md transition-shadow cursor-pointer ${
                selectedCards.has(card.id) ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-200'
              }`}
              onClick={() => onToggleSelection(card.id)}
            >
              {/* Selection Checkbox */}
              <div className="absolute top-2 right-2">
                <Checkbox
                  checked={selectedCards.has(card.id)}
                  onCheckedChange={() => onToggleSelection(card.id)}
                  className="h-3 w-3 sm:h-4 sm:w-4"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Card Content */}
              <div className="space-y-2 pr-5">
                {/* Front */}
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                    Front
                  </div>
                  <div className="text-xs sm:text-sm text-gray-900 leading-relaxed break-words">
                    {card.front_content}
                  </div>
                </div>

                {/* Back */}
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                    Back
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 leading-relaxed break-words">
                    {card.back_content}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-gray-100">
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                    Level {card.difficulty_level}
                  </Badge>
                  
                  {card.times_reviewed > 0 && (
                    <Badge 
                      className={`text-xs px-1.5 py-0.5 ${getPerformanceColor(card)}`}
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
      ) : (
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8 p-2">
                  <Checkbox
                    checked={cards.every(card => selectedCards.has(card.id))}
                    onCheckedChange={() => {
                      const allSelected = cards.every(card => selectedCards.has(card.id));
                      cards.forEach(card => {
                        if (allSelected && selectedCards.has(card.id)) {
                          onToggleSelection(card.id);
                        } else if (!allSelected && !selectedCards.has(card.id)) {
                          onToggleSelection(card.id);
                        }
                      });
                    }}
                    className="h-3 w-3 sm:h-4 sm:w-4"
                  />
                </TableHead>
                <TableHead className="min-w-[120px] p-2 text-xs">Front</TableHead>
                <TableHead className="min-w-[120px] p-2 text-xs">Back</TableHead>
                <TableHead className="w-12 p-2 text-xs">Lvl</TableHead>
                <TableHead className="w-16 p-2 text-xs">Rev</TableHead>
                <TableHead className="w-16 p-2 text-xs">Succ</TableHead>
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
                  <TableCell className="p-2" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedCards.has(card.id)}
                      onCheckedChange={() => onToggleSelection(card.id)}
                      className="h-3 w-3 sm:h-4 sm:w-4"
                    />
                  </TableCell>
                  
                  <TableCell className="p-2">
                    <div className="text-xs text-gray-900 font-medium break-words">
                      {truncateText(card.front_content, 50)}
                    </div>
                  </TableCell>
                  
                  <TableCell className="p-2">
                    <div className="text-xs text-gray-600 break-words">
                      {truncateText(card.back_content, 50)}
                    </div>
                  </TableCell>
                  
                  <TableCell className="p-2">
                    <Badge variant="outline" className="text-xs px-1 py-0.5">
                      {card.difficulty_level}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="p-2">
                    <span className="text-xs text-gray-600">
                      {card.times_reviewed}
                    </span>
                  </TableCell>
                  
                  <TableCell className="p-2">
                    {card.times_reviewed > 0 ? (
                      <Badge 
                        className={`text-xs px-1 py-0.5 ${getPerformanceColor(card)}`}
                        variant="secondary"
                      >
                        {Math.round((card.times_correct / card.times_reviewed) * 100)}%
                      </Badge>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default FolderContentArea;
