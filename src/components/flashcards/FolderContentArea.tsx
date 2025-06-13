
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
    if (card.times_reviewed === 0) return 'bg-gray-200 text-gray-700 border border-gray-300';
    const successRate = (card.times_correct / card.times_reviewed) * 100;
    if (successRate >= 80) return 'bg-green-200 text-green-800 border border-green-300';
    if (successRate >= 50) return 'bg-yellow-200 text-yellow-800 border border-yellow-300';
    return 'bg-red-200 text-red-800 border border-red-300';
  };

  const truncateText = (text: string, maxLength: number = 40) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* View Toggle - Enhanced styling */}
      <div className="flex items-center justify-between border-t-2 border-slate-200 pt-3 sm:pt-4 bg-white rounded-lg p-3 shadow-sm">
        <div className="text-sm sm:text-base text-slate-700 font-medium">
          {cards.length} cards in this folder
        </div>
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToggleViewMode(folderId)}
            className={`flex items-center gap-2 h-8 px-3 text-xs transition-all duration-200 ${
              viewMode === 'grid' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-300'
            }`}
          >
            <Grid className="h-3 w-3" />
            <span className="hidden sm:inline">Grid</span>
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToggleViewMode(folderId)}
            className={`flex items-center gap-2 h-8 px-3 text-xs transition-all duration-200 ${
              viewMode === 'list' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-300'
            }`}
          >
            <List className="h-3 w-3" />
            <span className="hidden sm:inline">List</span>
          </Button>
        </div>
      </div>

      {/* Cards Display - Enhanced contrast */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`relative bg-white border-2 rounded-xl p-3 sm:p-4 hover:shadow-lg transition-all duration-200 cursor-pointer ${
                selectedCards.has(card.id) 
                  ? 'ring-4 ring-blue-300 border-blue-500 bg-blue-50 shadow-lg transform scale-[1.02]' 
                  : 'border-slate-300 hover:border-slate-400 hover:shadow-md'
              }`}
              onClick={() => onToggleSelection(card.id)}
            >
              {/* Selection Checkbox */}
              <div className="absolute top-3 right-3">
                <Checkbox
                  checked={selectedCards.has(card.id)}
                  onCheckedChange={() => onToggleSelection(card.id)}
                  className="h-4 w-4 border-2 border-slate-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Card Content */}
              <div className="space-y-3 pr-6">
                {/* Front */}
                <div>
                  <div className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
                    Front
                  </div>
                  <div className="text-sm sm:text-base text-slate-900 leading-relaxed break-words font-medium">
                    {card.front_content}
                  </div>
                </div>

                {/* Back */}
                <div>
                  <div className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
                    Back
                  </div>
                  <div className="text-sm sm:text-base text-slate-700 leading-relaxed break-words">
                    {card.back_content}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t-2 border-slate-200">
                  <Badge variant="outline" className="text-xs px-2 py-1 bg-slate-100 border-slate-300 text-slate-700">
                    Level {card.difficulty_level}
                  </Badge>
                  
                  {card.times_reviewed > 0 && (
                    <Badge 
                      className={`text-xs px-2 py-1 ${getPerformanceColor(card)}`}
                      variant="secondary"
                    >
                      {Math.round((card.times_correct / card.times_reviewed) * 100)}%
                    </Badge>
                  )}
                  
                  <span className="text-xs text-slate-600 font-medium">
                    {card.times_reviewed} reviews
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-slate-300 rounded-xl overflow-hidden bg-white shadow-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100 border-b-2 border-slate-300">
                <TableHead className="w-8 p-3">
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
                    className="h-4 w-4 border-2 border-slate-400"
                  />
                </TableHead>
                <TableHead className="min-w-[120px] p-3 text-sm font-bold text-slate-700">Front</TableHead>
                <TableHead className="min-w-[120px] p-3 text-sm font-bold text-slate-700">Back</TableHead>
                <TableHead className="w-12 p-3 text-sm font-bold text-slate-700">Lvl</TableHead>
                <TableHead className="w-16 p-3 text-sm font-bold text-slate-700">Rev</TableHead>
                <TableHead className="w-16 p-3 text-sm font-bold text-slate-700">Succ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cards.map((card, index) => (
                <TableRow
                  key={card.id}
                  className={`cursor-pointer transition-all duration-150 border-b border-slate-200 ${
                    selectedCards.has(card.id) 
                      ? 'bg-blue-100 hover:bg-blue-150 border-blue-300' 
                      : index % 2 === 0 
                        ? 'bg-white hover:bg-slate-50' 
                        : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                  onClick={() => onToggleSelection(card.id)}
                >
                  <TableCell className="p-3" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedCards.has(card.id)}
                      onCheckedChange={() => onToggleSelection(card.id)}
                      className="h-4 w-4 border-2 border-slate-400"
                    />
                  </TableCell>
                  
                  <TableCell className="p-3">
                    <div className="text-sm text-slate-900 font-medium break-words">
                      {truncateText(card.front_content, 50)}
                    </div>
                  </TableCell>
                  
                  <TableCell className="p-3">
                    <div className="text-sm text-slate-700 break-words">
                      {truncateText(card.back_content, 50)}
                    </div>
                  </TableCell>
                  
                  <TableCell className="p-3">
                    <Badge variant="outline" className="text-xs px-2 py-1 bg-slate-100 border-slate-300">
                      {card.difficulty_level}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="p-3">
                    <span className="text-sm text-slate-600 font-medium">
                      {card.times_reviewed}
                    </span>
                  </TableCell>
                  
                  <TableCell className="p-3">
                    {card.times_reviewed > 0 ? (
                      <Badge 
                        className={`text-xs px-2 py-1 ${getPerformanceColor(card)}`}
                        variant="secondary"
                      >
                        {Math.round((card.times_correct / card.times_reviewed) * 100)}%
                      </Badge>
                    ) : (
                      <span className="text-xs text-slate-500">-</span>
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
