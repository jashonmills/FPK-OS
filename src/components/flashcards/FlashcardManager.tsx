
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFlashcardManager } from '@/hooks/useFlashcardManager';
import { ArrowLeft, Grid, List, Search, Filter } from 'lucide-react';
import FlashcardGridView from './FlashcardGridView';
import FlashcardListView from './FlashcardListView';
import FlashcardFilterBar from './FlashcardFilterBar';
import FlashcardBatchActions from './FlashcardBatchActions';

interface FlashcardManagerProps {
  onBack: () => void;
}

const FlashcardManager: React.FC<FlashcardManagerProps> = ({ onBack }) => {
  const manager = useFlashcardManager();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <Card className="fpk-card border-0 shadow-sm bg-white w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Flashcard Manager
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Organize and manage your flashcard collection
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              {manager.totalCount} cards
            </Badge>
            {manager.selectedCount > 0 && (
              <Badge variant="default" className="text-sm bg-blue-600">
                {manager.selectedCount} selected
              </Badge>
            )}
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={manager.state.viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => manager.updateState({ viewMode: 'grid' })}
              className="flex items-center gap-2"
            >
              <Grid className="h-4 w-4" />
              <span className="hidden sm:inline">Grid</span>
            </Button>
            <Button
              variant={manager.state.viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => manager.updateState({ viewMode: 'list' })}
              className="flex items-center gap-2"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">List</span>
            </Button>
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>

          {/* Quick Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search flashcards..."
                value={manager.state.searchTerm}
                onChange={(e) => manager.updateState({ searchTerm: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <FlashcardFilterBar
            state={manager.state}
            onUpdateState={manager.updateState}
          />
        )}

        {/* Batch Actions */}
        {manager.selectedCount > 0 && (
          <FlashcardBatchActions
            selectedCount={manager.selectedCount}
            onBulkDelete={manager.bulkDeleteCards}
            onBulkArchive={manager.bulkArchiveCards}
            onClearSelection={manager.clearSelection}
          />
        )}
      </CardHeader>

      <CardContent className="p-6">
        {/* Main View */}
        {manager.state.viewMode === 'grid' ? (
          <FlashcardGridView
            groupedFlashcards={manager.groupedFlashcards}
            selectedCards={new Set(manager.selectedCards)}
            onToggleSelection={manager.toggleCardSelection}
            onSelectAll={manager.selectAllCards}
          />
        ) : (
          <FlashcardListView
            groupedFlashcards={manager.groupedFlashcards}
            selectedCards={new Set(manager.selectedCards)}
            onToggleSelection={manager.toggleCardSelection}
            onSelectAll={manager.selectAllCards}
          />
        )}

        {/* Empty State */}
        {manager.totalCount === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Grid className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No flashcards found
              </h3>
              <p className="text-gray-600">
                {manager.state.searchTerm || manager.state.filterBy !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create some flashcards to get started'}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FlashcardManager;
