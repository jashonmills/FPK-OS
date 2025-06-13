
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, SortAsc, SortDesc } from 'lucide-react';
import type { FlashcardManagerState } from '@/hooks/useFlashcardManager';

interface FlashcardFilterBarProps {
  state: FlashcardManagerState;
  onUpdateState: (updates: Partial<FlashcardManagerState>) => void;
}

const FlashcardFilterBar: React.FC<FlashcardFilterBarProps> = ({
  state,
  onUpdateState
}) => {
  const clearFilters = () => {
    onUpdateState({
      filterBy: 'all',
      filterValue: '',
      searchTerm: '',
      sortBy: 'created',
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = state.filterBy !== 'all' || state.searchTerm || 
    state.sortBy !== 'created' || state.sortOrder !== 'desc';

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Filters & Sorting</h4>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filter By */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Filter By</label>
          <Select
            value={state.filterBy}
            onValueChange={(value: 'all' | 'source' | 'difficulty' | 'performance') => 
              onUpdateState({ filterBy: value, filterValue: '' })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cards</SelectItem>
              <SelectItem value="source">Source</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filter Value */}
        {state.filterBy !== 'all' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Filter Value</label>
            <Select
              value={state.filterValue}
              onValueChange={(value) => onUpdateState({ filterValue: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {state.filterBy === 'source' && (
                  <>
                    <SelectItem value="manual">Manual Cards</SelectItem>
                    <SelectItem value="notes">From Notes</SelectItem>
                    <SelectItem value="uploads">From Uploads</SelectItem>
                  </>
                )}
                {state.filterBy === 'difficulty' && (
                  <>
                    <SelectItem value="1">Level 1</SelectItem>
                    <SelectItem value="2">Level 2</SelectItem>
                    <SelectItem value="3">Level 3</SelectItem>
                    <SelectItem value="4">Level 4</SelectItem>
                    <SelectItem value="5">Level 5</SelectItem>
                  </>
                )}
                {state.filterBy === 'performance' && (
                  <>
                    <SelectItem value="high">High (80%+)</SelectItem>
                    <SelectItem value="medium">Medium (50-79%)</SelectItem>
                    <SelectItem value="low">Low (&lt;50%)</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Sort By */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Sort By</label>
          <Select
            value={state.sortBy}
            onValueChange={(value: 'created' | 'difficulty' | 'performance' | 'alphabetical') => 
              onUpdateState({ sortBy: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Date Created</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Order</label>
          <Button
            variant="outline"
            onClick={() => onUpdateState({ 
              sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' 
            })}
            className="w-full justify-start"
          >
            {state.sortOrder === 'asc' ? (
              <>
                <SortAsc className="h-4 w-4 mr-2" />
                Ascending
              </>
            ) : (
              <>
                <SortDesc className="h-4 w-4 mr-2" />
                Descending
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {state.searchTerm && (
            <Badge variant="secondary" className="text-xs">
              Search: "{state.searchTerm}"
              <button
                onClick={() => onUpdateState({ searchTerm: '' })}
                className="ml-1 hover:text-gray-900"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {state.filterBy !== 'all' && state.filterValue && (
            <Badge variant="secondary" className="text-xs">
              {state.filterBy}: {state.filterValue}
              <button
                onClick={() => onUpdateState({ filterBy: 'all', filterValue: '' })}
                className="ml-1 hover:text-gray-900"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {(state.sortBy !== 'created' || state.sortOrder !== 'desc') && (
            <Badge variant="secondary" className="text-xs">
              Sort: {state.sortBy} ({state.sortOrder})
              <button
                onClick={() => onUpdateState({ sortBy: 'created', sortOrder: 'desc' })}
                className="ml-1 hover:text-gray-900"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default FlashcardFilterBar;
