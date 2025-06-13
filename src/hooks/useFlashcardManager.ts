import { useState, useMemo } from 'react';
import { useFlashcards, type Flashcard } from '@/hooks/useFlashcards';
import { useFlashcardSets } from '@/hooks/useFlashcardSets';
import { analyzeFlashcardTopic } from '@/utils/flashcardTopicAnalyzer';

export interface FlashcardManagerState {
  selectedCards: Set<string>;
  searchTerm: string;
  filterBy: 'all' | 'source' | 'difficulty' | 'performance';
  filterValue: string;
  viewMode: 'grid' | 'list';
  sortBy: 'created' | 'difficulty' | 'performance' | 'alphabetical';
  sortOrder: 'asc' | 'desc';
  expandedFolders: Set<string>;
  folderViewModes: Record<string, 'grid' | 'list'>;
}

export const useFlashcardManager = () => {
  const { flashcards, deleteFlashcard, updateFlashcard } = useFlashcards();
  const { sets } = useFlashcardSets();
  
  const [state, setState] = useState<FlashcardManagerState>({
    selectedCards: new Set(),
    searchTerm: '',
    filterBy: 'all',
    filterValue: '',
    viewMode: 'grid',
    sortBy: 'created',
    sortOrder: 'desc',
    expandedFolders: new Set(),
    folderViewModes: {}
  });

  // Filter and search flashcards
  const filteredFlashcards = useMemo(() => {
    let filtered = [...flashcards];

    // Apply search
    if (state.searchTerm) {
      const term = state.searchTerm.toLowerCase();
      filtered = filtered.filter(card => 
        card.front_content.toLowerCase().includes(term) ||
        card.back_content.toLowerCase().includes(term)
      );
    }

    // Apply filters
    if (state.filterBy !== 'all' && state.filterValue) {
      switch (state.filterBy) {
        case 'difficulty':
          filtered = filtered.filter(card => 
            card.difficulty_level.toString() === state.filterValue
          );
          break;
        case 'performance':
          filtered = filtered.filter(card => {
            const successRate = card.times_reviewed > 0 
              ? (card.times_correct / card.times_reviewed) * 100 
              : 0;
            if (state.filterValue === 'high') return successRate >= 80;
            if (state.filterValue === 'medium') return successRate >= 50 && successRate < 80;
            if (state.filterValue === 'low') return successRate < 50;
            return true;
          });
          break;
        case 'source':
          // Filter by source (note_id or upload source)
          filtered = filtered.filter(card => {
            if (state.filterValue === 'manual') return !card.note_id;
            if (state.filterValue === 'notes') return !!card.note_id;
            return true;
          });
          break;
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (state.sortBy) {
        case 'created':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'difficulty':
          comparison = a.difficulty_level - b.difficulty_level;
          break;
        case 'performance':
          const aRate = a.times_reviewed > 0 ? (a.times_correct / a.times_reviewed) : 0;
          const bRate = b.times_reviewed > 0 ? (b.times_correct / b.times_reviewed) : 0;
          comparison = aRate - bRate;
          break;
        case 'alphabetical':
          comparison = a.front_content.localeCompare(b.front_content);
          break;
      }
      
      return state.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [flashcards, state.searchTerm, state.filterBy, state.filterValue, state.sortBy, state.sortOrder]);

  // Group flashcards by automatically detected topics/sources
  const groupedFlashcards = useMemo(() => {
    const groups: Record<string, Flashcard[]> = {};
    
    filteredFlashcards.forEach(card => {
      // Use the topic analyzer to determine the appropriate folder
      const topicFolder = analyzeFlashcardTopic(
        card.front_content, 
        card.back_content, 
        card.note_id,
        card.created_at
      );
      
      if (!groups[topicFolder]) {
        groups[topicFolder] = [];
      }
      groups[topicFolder].push(card);
    });
    
    // Sort groups by name for consistent ordering
    const sortedGroups: Record<string, Flashcard[]> = {};
    Object.keys(groups)
      .sort()
      .forEach(key => {
        sortedGroups[key] = groups[key];
      });
    
    return sortedGroups;
  }, [filteredFlashcards]);

  // Folder management
  const toggleFolder = (folderId: string) => {
    setState(prev => {
      const newExpanded = new Set(prev.expandedFolders);
      if (newExpanded.has(folderId)) {
        newExpanded.delete(folderId);
      } else {
        newExpanded.add(folderId);
      }
      return { ...prev, expandedFolders: newExpanded };
    });
  };

  const toggleFolderViewMode = (folderId: string) => {
    setState(prev => ({
      ...prev,
      folderViewModes: {
        ...prev.folderViewModes,
        [folderId]: prev.folderViewModes[folderId] === 'grid' ? 'list' : 'grid'
      }
    }));
  };

  const selectAllInFolder = (folderId: string) => {
    const folderCards = groupedFlashcards[folderId] || [];
    setState(prev => {
      const newSelected = new Set(prev.selectedCards);
      const allSelected = folderCards.every(card => newSelected.has(card.id));
      
      if (allSelected) {
        // Deselect all in folder
        folderCards.forEach(card => newSelected.delete(card.id));
      } else {
        // Select all in folder
        folderCards.forEach(card => newSelected.add(card.id));
      }
      
      return { ...prev, selectedCards: newSelected };
    });
  };

  const bulkFolderAction = async (folderId: string, action: 'delete' | 'archive') => {
    const folderCards = groupedFlashcards[folderId] || [];
    
    if (action === 'delete') {
      const promises = folderCards.map(card => deleteFlashcard(card.id));
      await Promise.all(promises);
    } else if (action === 'archive') {
      const promises = folderCards.map(card => 
        updateFlashcard({ id: card.id, difficulty_level: 0 }) // Use difficulty 0 as archived
      );
      await Promise.all(promises);
    }
    
    // Clear selections for this folder
    setState(prev => {
      const newSelected = new Set(prev.selectedCards);
      folderCards.forEach(card => newSelected.delete(card.id));
      return { ...prev, selectedCards: newSelected };
    });
  };

  // Selection management
  const toggleCardSelection = (cardId: string) => {
    setState(prev => {
      const newSelected = new Set(prev.selectedCards);
      if (newSelected.has(cardId)) {
        newSelected.delete(cardId);
      } else {
        newSelected.add(cardId);
      }
      return { ...prev, selectedCards: newSelected };
    });
  };

  const selectAllCards = () => {
    setState(prev => ({
      ...prev,
      selectedCards: new Set(filteredFlashcards.map(card => card.id))
    }));
  };

  const clearSelection = () => {
    setState(prev => ({
      ...prev,
      selectedCards: new Set()
    }));
  };

  // Batch operations
  const bulkDeleteCards = async () => {
    const promises = Array.from(state.selectedCards).map(cardId => 
      deleteFlashcard(cardId)
    );
    await Promise.all(promises);
    clearSelection();
  };

  const bulkArchiveCards = async () => {
    const promises = Array.from(state.selectedCards).map(cardId => 
      updateFlashcard({ id: cardId, difficulty_level: 0 }) // Use difficulty 0 as archived
    );
    await Promise.all(promises);
    clearSelection();
  };

  // State updates
  const updateState = (updates: Partial<FlashcardManagerState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return {
    state,
    updateState,
    filteredFlashcards,
    groupedFlashcards,
    selectedCards: Array.from(state.selectedCards),
    selectedCount: state.selectedCards.size,
    totalCount: filteredFlashcards.length,
    toggleCardSelection,
    selectAllCards,
    clearSelection,
    bulkDeleteCards,
    bulkArchiveCards,
    // Folder-specific methods
    toggleFolder,
    toggleFolderViewMode,
    selectAllInFolder,
    bulkFolderAction,
  };
};
