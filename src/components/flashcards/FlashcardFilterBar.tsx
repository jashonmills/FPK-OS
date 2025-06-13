
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid, List, SortAsc, SortDesc, Clock, Sparkles } from 'lucide-react';
import type { FlashcardManagerState } from '@/hooks/useFlashcardManager';

interface FlashcardFilterBarProps {
  state: FlashcardManagerState;
  onUpdateState: (updates: Partial<FlashcardManagerState>) => void;
  recentCardCount?: number;
}

const FlashcardFilterBar: React.FC<FlashcardFilterBarProps> = ({
  state,
  onUpdateState,
  recentCardCount = 0
}) => {
  return (
    <div className="space-y-4">
      {/* Recent Cards Quick Filter */}
      {recentCardCount > 0 && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-blue-800">
            {recentCardCount} new cards added recently
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateState({ 
              filterBy: 'recent',
              filterValue: 'true' 
            })}
            className="ml-auto bg-white hover:bg-blue-100 border-blue-300 text-blue-700"
          >
            <Clock className="h-3 w-3 mr-1" />
            View Recent
          </Button>
        </div>
      )}

      {/* Main Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Filter By */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Filter By</label>
          <Select 
            value={state.filterBy} 
            onValueChange={(value) => onUpdateState({ 
              filterBy: value,
              filterValue: value === 'all' ? '' : state.filterValue 
            })}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cards</SelectItem>
              <SelectItem value="recent">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  Recent (10 min)
                  {recentCardCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {recentCardCount}
                    </Badge>
                  )}
                </div>
              </SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="source">Source</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filter Value */}
        {state.filterBy !== 'all' && state.filterBy !== 'recent' && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Filter Value</label>
            <Select 
              value={state.filterValue} 
              onValueChange={(value) => onUpdateState({ filterValue: value })}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {state.filterBy === 'difficulty' && (
                  <>
                    <SelectItem value="1">Level 1 (Easy)</SelectItem>
                    <SelectItem value="2">Level 2 (Medium)</SelectItem>
                    <SelectItem value="3">Level 3 (Hard)</SelectItem>
                  </>
                )}
                {state.filterBy === 'performance' && (
                  <>
                    <SelectItem value="high">High (80%+)</SelectItem>
                    <SelectItem value="medium">Medium (50-79%)</SelectItem>
                    <SelectItem value="low">Low (<50%)</SelectItem>
                  </>
                )}
                {state.filterBy === 'source' && (
                  <>
                    <SelectItem value="manual">Manual Entry</SelectItem>
                    <SelectItem value="notes">From Notes</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Sort By */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Sort By</label>
          <Select 
            value={state.sortBy} 
            onValueChange={(value) => onUpdateState({ sortBy: value })}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Date Created</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order & View Mode */}
        <div className="flex gap-2">
          <div className="space-y-1 flex-1">
            <label className="text-xs font-medium text-gray-700">Order</label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateState({ 
                sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' 
              })}
              className="w-full h-9 justify-center text-sm"
            >
              {state.sortOrder === 'asc' ? (
                <>
                  <SortAsc className="h-3 w-3 mr-1" /> Asc
                </>
              ) : (
                <>
                  <SortDesc className="h-3 w-3 mr-1" /> Desc
                </>
              )}
            </Button>
          </div>
          
          <div className="space-y-1 flex-1">
            <label className="text-xs font-medium text-gray-700">View</label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateState({ 
                viewMode: state.viewMode === 'grid' ? 'list' : 'grid' 
              })}
              className="w-full h-9 justify-center text-sm"
            >
              {state.viewMode === 'grid' ? (
                <>
                  <Grid className="h-3 w-3 mr-1" /> Grid
                </>
              ) : (
                <>
                  <List className="h-3 w-3 mr-1" /> List
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(state.filterBy !== 'all' || state.searchTerm) && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
          <span className="text-xs text-gray-600">Active filters:</span>
          
          {state.searchTerm && (
            <Badge variant="secondary" className="text-xs">
              Search: "{state.searchTerm}"
              <button 
                onClick={() => onUpdateState({ searchTerm: '' })}
                className="ml-1 hover:text-red-600"
              >
                ×
              </button>
            </Badge>
          )}
          
          {state.filterBy !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              {state.filterBy === 'recent' ? 'Recent Cards' : `${state.filterBy}: ${state.filterValue}`}
              <button 
                onClick={() => onUpdateState({ filterBy: 'all', filterValue: '' })}
                className="ml-1 hover:text-red-600"
              >
                ×
              </button>
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpdateState({ 
              filterBy: 'all', 
              filterValue: '', 
              searchTerm: '' 
            })}
            className="text-xs h-6 px-2 text-gray-500 hover:text-gray-700"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default FlashcardFilterBar;
