
import { useState, useEffect } from 'react';
import { useFlashcards } from '@/hooks/useFlashcards';

export interface PreviewFlashcard {
  id: string;
  front_content: string;
  back_content: string;
  title?: string;
  source: 'upload' | 'manual' | 'notes';
  status: 'new' | 'edited' | 'ready';
  created_at: string;
  session_id?: string;
}

const STORAGE_KEY = 'flashcard_preview_cards';
const RECENT_CARDS_KEY = 'recent_flashcard_ids';
const RECENT_CARDS_DAYS = 7;

export const useFlashcardPreview = () => {
  const [previewCards, setPreviewCards] = useState<PreviewFlashcard[]>([]);
  const [recentCardIds, setRecentCardIds] = useState<string[]>([]);
  const { createFlashcard } = useFlashcards();

  // Load preview cards from localStorage on mount
  useEffect(() => {
    console.log('🔄 Loading preview cards from localStorage...');
    const stored = localStorage.getItem(STORAGE_KEY);
    const recentIds = localStorage.getItem(RECENT_CARDS_KEY);
    
    if (stored) {
      try {
        const cards = JSON.parse(stored);
        console.log('📦 Raw cards from localStorage:', cards);
        
        // Filter out cards older than 7 days
        const validCards = cards.filter((card: PreviewFlashcard) => {
          const cardDate = new Date(card.created_at);
          const daysDiff = (Date.now() - cardDate.getTime()) / (1000 * 60 * 60 * 24);
          return daysDiff <= RECENT_CARDS_DAYS;
        });
        
        console.log('✅ Valid cards after filtering:', validCards);
        setPreviewCards(validCards);
        
        // Clean up localStorage if we filtered out old cards
        if (validCards.length !== cards.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(validCards));
        }
      } catch (error) {
        console.error('💥 Error loading preview cards:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    if (recentIds) {
      try {
        setRecentCardIds(JSON.parse(recentIds));
      } catch (error) {
        console.error('Error loading recent card IDs:', error);
        localStorage.removeItem(RECENT_CARDS_KEY);
      }
    }
  }, []);

  // Save preview cards to localStorage
  const saveToStorage = (cards: PreviewFlashcard[]) => {
    console.log('💾 Saving preview cards to localStorage:', cards);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  };

  // Save recent card IDs to localStorage
  const saveRecentIds = (ids: string[]) => {
    localStorage.setItem(RECENT_CARDS_KEY, JSON.stringify(ids));
    setRecentCardIds(ids);
  };

  const addPreviewCard = (card: Omit<PreviewFlashcard, 'id' | 'created_at'>) => {
    console.log('➕ Adding single preview card:', card);
    
    const newCard: PreviewFlashcard = {
      ...card,
      id: `preview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
    };

    console.log('🆕 New card created:', newCard);
    const updatedCards = [...previewCards, newCard];
    console.log('📋 Updated cards array:', updatedCards);
    
    setPreviewCards(updatedCards);
    saveToStorage(updatedCards);
    return newCard.id;
  };

  const addPreviewCards = (cards: Omit<PreviewFlashcard, 'id' | 'created_at'>[]) => {
    console.log('➕➕ Adding multiple preview cards:', cards);
    
    const newCards = cards.map(card => {
      const newCard = {
        ...card,
        id: `preview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString(),
      };
      console.log('🆕 Individual new card created:', newCard);
      return newCard;
    });

    console.log('🆕🆕 All new cards created:', newCards);
    const updatedCards = [...previewCards, ...newCards];
    console.log('📋📋 Final updated cards array:', updatedCards);
    
    setPreviewCards(updatedCards);
    saveToStorage(updatedCards);
    return newCards.map(card => card.id);
  };

  const updatePreviewCard = (id: string, updates: Partial<PreviewFlashcard>) => {
    const updatedCards = previewCards.map(card =>
      card.id === id 
        ? { ...card, ...updates, status: 'edited' as const }
        : card
    );
    setPreviewCards(updatedCards);
    saveToStorage(updatedCards);
  };

  const deletePreviewCard = (id: string) => {
    const updatedCards = previewCards.filter(card => card.id !== id);
    setPreviewCards(updatedCards);
    saveToStorage(updatedCards);
  };

  const approveCard = async (id: string) => {
    const card = previewCards.find(c => c.id === id);
    if (!card) return null;

    try {
      // Save to database via useFlashcards hook
      createFlashcard({
        front_content: card.front_content,
        back_content: card.back_content,
        difficulty_level: 1
      });

      // Remove from preview and add to recent
      const updatedCards = previewCards.filter(c => c.id !== id);
      setPreviewCards(updatedCards);
      saveToStorage(updatedCards);

      // Add to recent cards (we'll use a timestamp-based ID for recent tracking)
      const recentId = `recent_${Date.now()}`;
      const updatedRecentIds = [recentId, ...recentCardIds.slice(0, 19)]; // Keep last 20
      saveRecentIds(updatedRecentIds);

      return true;
    } catch (error) {
      console.error('Error approving card:', error);
      return false;
    }
  };

  const approveAllCards = async () => {
    const results = await Promise.allSettled(
      previewCards.map(card => approveCard(card.id))
    );
    
    const successful = results.filter(result => 
      result.status === 'fulfilled' && result.value === true
    ).length;
    
    return successful;
  };

  const clearPreviewCards = () => {
    setPreviewCards([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    previewCards,
    recentCardIds,
    addPreviewCard,
    addPreviewCards,
    updatePreviewCard,
    deletePreviewCard,
    approveCard,
    approveAllCards,
    clearPreviewCards,
    hasPreviewCards: previewCards.length > 0,
  };
};
