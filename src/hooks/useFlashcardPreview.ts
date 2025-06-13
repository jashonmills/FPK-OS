
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
    
    setPreviewCards(prev => {
      const updatedCards = [...prev, newCard];
      console.log('📋 Updated cards array:', updatedCards);
      saveToStorage(updatedCards);
      return updatedCards;
    });
    
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
    
    setPreviewCards(prev => {
      const updatedCards = [...prev, ...newCards];
      console.log('📋📋 Final updated cards array:', updatedCards);
      saveToStorage(updatedCards);
      return updatedCards;
    });
    
    return newCards.map(card => card.id);
  };

  const updatePreviewCard = (id: string, updates: Partial<PreviewFlashcard>) => {
    setPreviewCards(prev => {
      const updatedCards = prev.map(card =>
        card.id === id 
          ? { ...card, ...updates, status: 'edited' as const }
          : card
      );
      saveToStorage(updatedCards);
      return updatedCards;
    });
  };

  const deletePreviewCard = (id: string) => {
    setPreviewCards(prev => {
      const updatedCards = prev.filter(card => card.id !== id);
      saveToStorage(updatedCards);
      return updatedCards;
    });
  };

  const approveCard = async (id: string): Promise<boolean> => {
    const card = previewCards.find(c => c.id === id);
    if (!card) {
      console.error('❌ Card not found for approval:', id);
      return false;
    }

    console.log('✅ Approving card:', card);

    try {
      // Create a promise wrapper for the mutation
      const createFlashcardPromise = new Promise<boolean>((resolve, reject) => {
        createFlashcard(
          {
            front_content: card.front_content,
            back_content: card.back_content,
            difficulty_level: 1
          },
          {
            onSuccess: (data) => {
              console.log('✅ Flashcard successfully created in database:', data);
              resolve(true);
            },
            onError: (error) => {
              console.error('❌ Failed to create flashcard in database:', error);
              reject(error);
            }
          }
        );
      });

      // Wait for the database operation to complete
      await createFlashcardPromise;

      // Only remove from preview if database operation succeeded
      setPreviewCards(prev => {
        const updatedCards = prev.filter(c => c.id !== id);
        console.log('🗑️ Removed card from preview, remaining cards:', updatedCards.length);
        saveToStorage(updatedCards);
        return updatedCards;
      });

      // Add to recent cards tracking
      const recentId = `recent_${Date.now()}`;
      const updatedRecentIds = [recentId, ...recentCardIds.slice(0, 19)];
      saveRecentIds(updatedRecentIds);

      console.log('✅ Card approval completed successfully');
      return true;

    } catch (error) {
      console.error('❌ Error approving card:', error);
      return false;
    }
  };

  const approveAllCards = async (): Promise<number> => {
    console.log('✅ Starting bulk approval of', previewCards.length, 'cards');
    
    let successful = 0;
    const cardsToApprove = [...previewCards]; // Create a copy to avoid state changes during iteration

    for (const card of cardsToApprove) {
      const success = await approveCard(card.id);
      if (success) {
        successful++;
      }
    }

    console.log('✅ Bulk approval completed:', successful, 'successful out of', cardsToApprove.length);
    return successful;
  };

  const clearPreviewCards = () => {
    console.log('🗑️ Clearing all preview cards');
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
