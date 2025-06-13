
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
    <div className="bg-white rounded-xl shadow-lg border-2 border-slate-300 w-full overflow-hidden">
      {/* Header - Enhanced styling */}
      <div className="border-b-2 border-slate-300 p-3 sm:p-5 lg:p-7 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between mb-4 sm:mb-5 lg:mb-7">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 sm:p-2.5 shrink-0 hover:bg-slate-100 border border-slate-300 rounded-lg"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-3xl font-bold text-slate-900 truncate">
                {isMobile ? 'Flashcards' : 'Flashcard Manager'}
              </h1>
              {!isMobile && (
                <p className="text-sm sm:text-base text-slate-600 mt-1 hidden sm:block">
                  Organize and manage your flashcard collection by folders
                </p>
              )}
            </div>
          </div>
          
          {/* Stats - Desktop only to save space */}
          {!isMobile && (
            <div className="flex items-center gap-3 shrink-0">
              <Badge variant="secondary" className="text-sm bg-slate-200 text-slate-700 border border-slate-300 px-3 py-1">
                {Object.keys(manager.groupedFlashcards).length} folders
              </Badge>
              <Badge variant="secondary" className="text-sm bg-slate-200 text-slate-700 border border-slate-300 px-3 py-1">
                {manager.totalCount} cards
              </Badge>
              {manager.selectedCount > 0 && (
                <Badge variant="default" className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 shadow-md">
                  {manager.selectedCount} selected
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Mobile Stats Row */}
        {isMobile && (
          <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-slate-600">
            <Badge variant="outline" className="text-xs bg-white border-slate-300 text-slate-700">{Object.keys(manager.groupedFlashcards).length} folders</Badge>
            <Badge variant="outline" className="text-xs bg-white border-slate-300 text-slate-700">{manager.totalCount} cards</Badge>
            {manager.selectedCount > 0 && (
              <Badge variant="default" className="text-xs bg-blue-600">{manager.selectedCount} selected</Badge>
            )}
          </div>
        )}

        {/* Controls Row - Enhanced styling */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          {/* Filter Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 w-full sm:w-auto text-sm transition-all duration-200 border-2 ${
              showFilters 
                ? 'bg-blue-100 border-blue-400 text-blue-700 hover:bg-blue-150' 
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>

          {/* Quick Search - Enhanced styling */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search flashcards..."
                value={manager.state.searchTerm}
                onChange={(e) => manager.updateState({ searchTerm: e.target.value })}
                className="w-full pl-10 sm:pl-12 pr-4 sm:pr-5 py-2.5 sm:py-3 border-2 border-slate-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Filters - Enhanced background */}
        {showFilters && (
          <div className="mt-4 sm:mt-5 p-4 bg-slate-100 rounded-lg border border-slate-300">
            <FlashcardFilterBar
              state={manager.state}
              onUpdateState={manager.updateState}
            />
          </div>
        )}

        {/* Batch Actions - Enhanced styling */}
        {manager.selectedCount > 0 && (
          <div className="mt-4 sm:mt-5 p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
            <FlashcardBatchActions
              selectedCount={manager.selectedCount}
              onBulkDelete={manager.bulkDeleteCards}
              onBulkArchive={manager.bulkArchiveCards}
              onClearSelection={manager.clearSelection}
            />
          </div>
        )}
      </div>

      {/* Main Content - Enhanced background */}
      <div className="p-3 sm:p-5 lg:p-7 bg-slate-50 min-h-[400px]">
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
