
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFlashcardManager } from '@/hooks/useFlashcardManager';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import FlashcardFolderView from './FlashcardFolderView';
import FlashcardFilterBar from './FlashcardFilterBar';
import FlashcardBatchActions from './FlashcardBatchActions';

interface FlashcardManagerProps {
  onBack: () => void;
}

const FlashcardManager: React.FC<FlashcardManagerProps> = ({ onBack }) => {
  const manager = useFlashcardManager();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
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
              <h1 className="text-2xl font-bold text-gray-900">
                Flashcard Manager
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Organize and manage your flashcard collection by folders
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              {Object.keys(manager.groupedFlashcards).length} folders
            </Badge>
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
        <div className="flex flex-col sm:flex-row gap-4">
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
          <div className="mt-4">
            <FlashcardFilterBar
              state={manager.state}
              onUpdateState={manager.updateState}
            />
          </div>
        )}

        {/* Batch Actions */}
        {manager.selectedCount > 0 && (
          <div className="mt-4">
            <FlashcardBatchActions
              selectedCount={manager.selectedCount}
              onBulkDelete={manager.bulkDeleteCards}
              onBulkArchive={manager.bulkArchiveCards}
              onClearSelection={manager.clearSelection}
            />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-6">
        <FlashcardFolderView
          groupedFlashcards={manager.groupedFlashcards}
          selectedCards={new Set(manager.selectedCards)}
          expandedFolders={manager.state.expandedFolders}
          folderViewModes={manager.state.folderViewModes}
          onToggleSelection={manager.toggleCardSelection}
          onToggleFolder={manager.toggleFolder}
          onToggleFolderViewMode={manager.toggleFolderViewMode}
          onSelectAllInFolder={manager.selectAllInFolder}
          onBulkFolderAction={manager.bulkFolderAction}
        />
      </div>
    </div>
  );
};

export default FlashcardManager;
