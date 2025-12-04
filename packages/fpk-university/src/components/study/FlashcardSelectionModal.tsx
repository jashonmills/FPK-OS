
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFlashcards } from '@/hooks/useFlashcards';
import { analyzeFlashcardTopic } from '@/utils/flashcardTopicAnalyzer';
import { Brain, Sparkles, Clock } from 'lucide-react';
import type { Flashcard } from '@/hooks/useFlashcards';
import FlashcardSelectionHeader from './FlashcardSelectionHeader';
import FlashcardFolderList from './FlashcardFolderList';
import FlashcardIndividualList from './FlashcardIndividualList';

interface FlashcardSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedFlashcards: Flashcard[]) => void;
  studyMode: 'memory_test' | 'multiple_choice' | 'timed_challenge';
}

const FlashcardSelectionModal: React.FC<FlashcardSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  studyMode
}) => {
  const { flashcards, isLoading } = useFlashcards();
  
  // Debug logging
  React.useEffect(() => {
    console.log('🔍 FlashcardSelectionModal - flashcards data:', { 
      count: flashcards.length, 
      isLoading,
      flashcards: flashcards.slice(0, 3) // Show first 3 for debugging
    });
  }, [flashcards, isLoading]);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [selectedIndividualCards, setSelectedIndividualCards] = useState<string[]>([]);
  const [selectedRecentCards, setSelectedRecentCards] = useState<string[]>([]);
  const [showIndividualCards, setShowIndividualCards] = useState(false);
  const [activeTab, setActiveTab] = useState('folders');

  // Get recent cards (last 7 days) and sort by creation date
  const recentCards = React.useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return flashcards
      .filter(card => new Date(card.created_at) > sevenDaysAgo)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 20); // Show max 20 recent cards
  }, [flashcards]);

  // Group flashcards by topic using the same logic as FlashcardManager
  const groupedFlashcards = React.useMemo(() => {
    const groups: Record<string, Flashcard[]> = {};
    
    // Only include non-recent cards in folders
    const olderCards = flashcards.filter(card => 
      !recentCards.some(recent => recent.id === card.id)
    );
    
    olderCards.forEach(card => {
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
    
    const sortedGroups: Record<string, Flashcard[]> = {};
    Object.keys(groups)
      .sort()
      .forEach(key => {
        sortedGroups[key] = groups[key];
      });
    
    return sortedGroups;
  }, [flashcards, recentCards]);

  const handleFolderToggle = (folderId: string) => {
    setSelectedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const handleRecentCardToggle = (cardId: string) => {
    setSelectedRecentCards(prev =>
      prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const handleSelectAllRecent = () => {
    if (selectedRecentCards.length === recentCards.length) {
      setSelectedRecentCards([]);
    } else {
      setSelectedRecentCards(recentCards.map(card => card.id));
    }
  };

  const handleSelectAll = () => {
    const allFolderIds = Object.keys(groupedFlashcards);
    setSelectedFolders(allFolderIds);
    setSelectedIndividualCards([]);
    setSelectedRecentCards(recentCards.map(card => card.id));
  };

  const handleIndividualCardToggle = (cardId: string) => {
    setSelectedIndividualCards(prev =>
      prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const getSelectedFlashcards = () => {
    const selectedCards: Flashcard[] = [];
    
    // Add selected recent cards
    const selectedRecentFlashcards = flashcards.filter(card => 
      selectedRecentCards.includes(card.id)
    );
    selectedCards.push(...selectedRecentFlashcards);

    if (showIndividualCards) {
      // Add selected individual cards (non-recent)
      const selectedIndividualFlashcards = flashcards.filter(card => 
        selectedIndividualCards.includes(card.id)
      );
      selectedCards.push(...selectedIndividualFlashcards);
    } else {
      // Add selected folder cards
      selectedFolders.forEach(folderId => {
        const folderCards = groupedFlashcards[folderId] || [];
        selectedCards.push(...folderCards);
      });
    }
    
    return selectedCards;
  };

  const selectedCards = getSelectedFlashcards();

  const handleConfirm = () => {
    if (selectedCards.length === 0) {
      alert('Please select at least one flashcard to study.');
      return;
    }
    onConfirm(selectedCards);
  };

  // Reset selections when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedFolders([]);
      setSelectedIndividualCards([]);
      setSelectedRecentCards([]);
      setShowIndividualCards(false);
      setActiveTab('folders');
    }
  }, [isOpen]);

  const studyModeNames = {
    memory_test: 'Memory Test',
    multiple_choice: 'Multiple Choice',
    timed_challenge: 'Timed Challenge'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Select Flashcards for {studyModeNames[studyMode]}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="folders" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                By Folders
              </TabsTrigger>
              <TabsTrigger value="individual" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Individual Cards
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden min-h-0 mt-4">
              <TabsContent value="folders" className="h-full overflow-hidden mt-0">
                <FlashcardSelectionHeader
                  showIndividualCards={false}
                  onToggleView={() => {}}
                  onSelectAll={handleSelectAll}
                  selectedCount={selectedCards.length}
                />

                <ScrollArea className="flex-1 h-[400px] pr-4">
                  <div className="space-y-6">
                    {/* Recent Cards Section */}
                    {recentCards.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-green-600" />
                            <h3 className="font-medium text-green-900">Recent Cards</h3>
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              {recentCards.length} new
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleSelectAllRecent}
                            className="text-xs border-green-200 text-green-700 hover:bg-green-50"
                          >
                            {selectedRecentCards.length === recentCards.length ? 'Deselect All' : 'Select All Recent'}
                          </Button>
                        </div>
                        
                        <div className="grid gap-2">
                          {recentCards.map((card) => (
                            <div
                              key={card.id}
                              className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                selectedRecentCards.includes(card.id)
                                  ? 'border-green-400 bg-green-50 shadow-sm'
                                  : 'border-green-200 bg-green-25 hover:border-green-300 hover:bg-green-50'
                              }`}
                              onClick={() => handleRecentCardToggle(card.id)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge className="bg-green-100 text-green-800 text-xs animate-pulse">
                                      <Sparkles className="h-3 w-3 mr-1" />
                                      NEW
                                    </Badge>
                                    <span className="text-xs text-green-600">
                                      <Clock className="h-3 w-3 inline mr-1" />
                                      {new Date(card.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {card.front_content.substring(0, 80)}...
                                  </p>
                                  <p className="text-xs text-gray-600 truncate mt-1">
                                    {card.back_content.substring(0, 60)}...
                                  </p>
                                </div>
                                <div className={`w-4 h-4 rounded border-2 flex-shrink-0 ml-2 ${
                                  selectedRecentCards.includes(card.id)
                                    ? 'bg-green-500 border-green-500'
                                    : 'border-gray-300'
                                }`}>
                                  {selectedRecentCards.includes(card.id) && (
                                    <div className="w-full h-full bg-white rounded-sm scale-50"></div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Older Cards Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                        <h3 className="font-medium text-gray-700">Study Collection</h3>
                        {Object.keys(groupedFlashcards).length > 0 && (
                          <Badge variant="outline">
                            {Object.values(groupedFlashcards).reduce((sum, cards) => sum + cards.length, 0)} cards
                          </Badge>
                        )}
                      </div>

                      <FlashcardFolderList
                        groupedFlashcards={groupedFlashcards}
                        selectedFolders={selectedFolders}
                        onFolderToggle={handleFolderToggle}
                      />
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="individual" className="h-full overflow-hidden mt-0">
                <FlashcardSelectionHeader
                  showIndividualCards={true}
                  onToggleView={() => {}}
                  onSelectAll={handleSelectAll}
                  selectedCount={selectedCards.length}
                />

                <ScrollArea className="flex-1 h-[400px] pr-4">
                  <FlashcardIndividualList
                    flashcards={Object.values(groupedFlashcards).flat()}
                    selectedCards={selectedIndividualCards}
                    onCardToggle={handleIndividualCardToggle}
                  />
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={selectedCards.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            Start Studying ({selectedCards.length} cards)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FlashcardSelectionModal;
