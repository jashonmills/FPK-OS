
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFlashcardManager } from '@/hooks/useFlashcardManager';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const isMobile = useIsMobile();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 p-2 sm:p-4 lg:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-1.5 sm:p-2 shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 truncate">
                {isMobile ? 'Flashcards' : 'Flashcard Manager'}
              </h1>
              {!isMobile && (
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 hidden sm:block">
                  Organize and manage your flashcard collection by folders
                </p>
              )}
            </div>
          </div>
          
          {/* Stats - Desktop only to save space */}
          {!isMobile && (
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="secondary" className="text-xs">
                {Object.keys(manager.groupedFlashcards).length}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {manager.totalCount}
              </Badge>
              {manager.selectedCount > 0 && (
                <Badge variant="default" className="text-xs bg-blue-600">
                  {manager.selectedCount}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Mobile Stats Row */}
        {isMobile && (
          <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-gray-600">
            <Badge variant="outline" className="text-xs">{Object.keys(manager.groupedFlashcards).length} folders</Badge>
            <Badge variant="outline" className="text-xs">{manager.totalCount} cards</Badge>
            {manager.selectedCount > 0 && (
              <Badge variant="default" className="text-xs bg-blue-600">{manager.selectedCount} selected</Badge>
            )}
          </div>
        )}

        {/* Controls Row */}
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          {/* Filter Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm"
          >
            <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
            Filters
          </Button>

          {/* Quick Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search flashcards..."
                value={manager.state.searchTerm}
                onChange={(e) => manager.updateState({ searchTerm: e.target.value })}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-3 sm:mt-4">
            <FlashcardFilterBar
              state={manager.state}
              onUpdateState={manager.updateState}
            />
          </div>
        )}

        {/* Batch Actions */}
        {manager.selectedCount > 0 && (
          <div className="mt-3 sm:mt-4">
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
      <div className="p-2 sm:p-4 lg:p-6">
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
