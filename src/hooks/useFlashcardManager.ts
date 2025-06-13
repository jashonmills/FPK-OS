import { useState, useMemo, useEffect } from 'react';
import { useFlashcards, type Flashcard } from '@/hooks/useFlashcards';
import { useFlashcardSets } from '@/hooks/useFlashcardSets';
import { analyzeFlashcardTopic } from '@/utils/flashcardTopicAnalyzer';

export interface FlashcardManagerState {
  selectedCards: Set<string>;
  searchTerm: string;
  filterBy: 'all' | 'source' | 'difficulty' | 'performance' | 'recent';
  filterValue: string;
  viewMode: 'grid' | 'list';
  sortBy: 'created' | 'difficulty' | 'performance' | 'alphabetical';
  sortOrder: 'asc' | 'desc';
  expandedFolders: Set<string>;
  folderViewModes: Record<string, 'grid' | 'list'>;
}

const RECENT_CARDS_MINUTES = 10; // Consider cards "new" for 10 minutes

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

  // Track recently created cards
  const recentCardIds = useMemo(() => {
    const cutoffTime = new Date(Date.now() - RECENT_CARDS_MINUTES * 60 * 1000);
    return flashcards
      .filter(card => new Date(card.created_at) > cutoffTime)
      .map(card => card.id);
  }, [flashcards]);

  // Auto-expand folders with recent cards
  useEffect(() => {
    if (recentCardIds.length > 0) {
      console.log('📌 Found recent cards, auto-expanding relevant folders:', recentCardIds);
      
      // Find folders that contain recent cards
      const foldersWithRecentCards = new Set<string>();
      
      recentCardIds.forEach(cardId => {
        const card = flashcards.find(c => c.id === cardId);
        if (card) {
          const topicFolder = analyzeFlashcardTopic(
            card.front_content, 
            card.back_content, 
            card.note_id,
            card.created_at
          );
          foldersWithRecentCards.add(topicFolder);
        }
      });

      if (foldersWithRecentCards.size > 0) {
        setState(prev => ({
          ...prev,
          expandedFolders: new Set([...prev.expandedFolders, ...foldersWithRecentCards])
        }));
      }
    }
  }, [recentCardIds, flashcards]);

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
        case 'recent':
          filtered = filtered.filter(card => recentCardIds.includes(card.id));
          break;
      }
    }

    // Apply sorting - prioritize recent cards
    filtered.sort((a, b) => {
      // Always put recent cards first
      const aIsRecent = recentCardIds.includes(a.id);
      const bIsRecent = recentCardIds.includes(b.id);
      
      if (aIsRecent && !bIsRecent) return -1;
      if (!aIsRecent && bIsRecent) return 1;
      
      // Then apply normal sorting
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
  }, [flashcards, state.searchTerm, state.filterBy, state.filterValue, state.sortBy, state.sortOrder, recentCardIds]);

  // Group flashcards by automatically detected topics/sources - prioritize folders with recent cards
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
    
    // Sort groups by whether they contain recent cards, then by name
    const sortedGroups: Record<string, Flashcard[]> = {};
    Object.keys(groups)
      .sort((a, b) => {
        const aHasRecent = groups[a].some(card => recentCardIds.includes(card.id));
        const bHasRecent = groups[b].some(card => recentCardIds.includes(card.id));
        
        if (aHasRecent && !bHasRecent) return -1;
        if (!aHasRecent && bHasRecent) return 1;
        
        return a.localeCompare(b);
      })
      .forEach(key => {
        sortedGroups[key] = groups[key];
      });
    
    return sortedGroups;
  }, [filteredFlashcards, recentCardIds]);

  // Check if a card is recent
  const isCardRecent = (cardId: string) => recentCardIds.includes(cardId);

  // Check if a folder has recent cards
  const folderHasRecentCards = (folderId: string) => {
    const folderCards = groupedFlashcards[folderId] || [];
    return folderCards.some(card => isCardRecent(card.id));
  };

  // Get recent card count for a folder
  const getRecentCardCount = (folderId: string) => {
    const folderCards = groupedFlashcards[folderId] || [];
    return folderCards.filter(card => isCardRecent(card.id)).length;
  };

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
    recentCardIds,
    recentCardCount: recentCardIds.length,
    isCardRecent,
    folderHasRecentCards,
    getRecentCardCount,
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
