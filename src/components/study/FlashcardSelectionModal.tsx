
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFlashcards } from '@/hooks/useFlashcards';
import { analyzeFlashcardTopic } from '@/utils/flashcardTopicAnalyzer';
import { Folder, FileText, Brain, Users, BookOpen, Edit, Upload } from 'lucide-react';
import type { Flashcard } from '@/hooks/useFlashcards';

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
  const { flashcards } = useFlashcards();
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [selectedIndividualCards, setSelectedIndividualCards] = useState<string[]>([]);
  const [showIndividualCards, setShowIndividualCards] = useState(false);

  // Group flashcards by topic using the same logic as FlashcardManager
  const groupedFlashcards = React.useMemo(() => {
    const groups: Record<string, Flashcard[]> = {};
    
    flashcards.forEach(card => {
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
  }, [flashcards]);

  const getFolderIcon = (folderName: string) => {
    // Topic-based icons
    if (folderName.includes('Goonies')) return FileText;
    if (folderName.includes('Learning State')) return Brain;
    if (folderName.includes('Dragon Fire')) return FileText;
    if (folderName.includes('Cannabis')) return FileText;
    if (folderName.includes('Photography')) return FileText;
    if (folderName.includes('Wellness')) return FileText;
    if (folderName.includes('Technology')) return FileText;
    if (folderName.includes('Science')) return FileText;
    if (folderName.includes('Business')) return FileText;
    if (folderName.includes('History')) return FileText;
    
    // Source-based icons
    if (folderName.includes('Manual')) return Edit;
    if (folderName.includes('Notes') || folderName.includes('Study Notes')) return BookOpen;
    if (folderName.includes('Upload') || folderName.includes('Recent Upload')) return Upload;
    
    return Folder;
  };

  const getFolderType = (folderName: string) => {
    // Check if it's a topic-based folder
    const topicFolders = ['Goonies', 'Learning State', 'Dragon Fire', 'Cannabis', 'Photography', 
                         'Wellness', 'Technology', 'Science', 'Business', 'History'];
    
    for (const topic of topicFolders) {
      if (folderName.includes(topic)) {
        return 'Topic';
      }
    }
    
    // Source-based categorization
    if (folderName.includes('Manual')) return 'Manual';
    if (folderName.includes('Notes') || folderName.includes('Study Notes')) return 'Notes';
    if (folderName.includes('Upload') || folderName.includes('Recent Upload')) return 'Upload';
    
    return 'Auto-grouped';
  };

  const handleFolderToggle = (folderId: string) => {
    setSelectedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const handleSelectAll = () => {
    const allFolderIds = Object.keys(groupedFlashcards);
    setSelectedFolders(allFolderIds);
    setSelectedIndividualCards([]);
  };

  const handleIndividualCardToggle = (cardId: string) => {
    setSelectedIndividualCards(prev =>
      prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const getSelectedFlashcards = () => {
    if (showIndividualCards) {
      return flashcards.filter(card => selectedIndividualCards.includes(card.id));
    } else {
      const selectedCards: Flashcard[] = [];
      selectedFolders.forEach(folderId => {
        const folderCards = groupedFlashcards[folderId] || [];
        selectedCards.push(...folderCards);
      });
      return selectedCards;
    }
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
      setShowIndividualCards(false);
    }
  }, [isOpen]);

  const studyModeNames = {
    memory_test: 'Memory Test',
    multiple_choice: 'Multiple Choice',
    timed_challenge: 'Timed Challenge'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Select Flashcards for {studyModeNames[studyMode]}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="space-y-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button 
                  variant={!showIndividualCards ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowIndividualCards(false)}
                >
                  <Folder className="h-4 w-4 mr-1" />
                  By Folders
                </Button>
                <Button 
                  variant={showIndividualCards ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowIndividualCards(true)}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Individual Cards
                </Button>
              </div>
              
              {!showIndividualCards && (
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  <Users className="h-4 w-4 mr-1" />
                  Select All Folders
                </Button>
              )}
            </div>

            <div className="text-sm text-gray-600">
              Selected: <Badge variant="secondary">{selectedCards.length} cards</Badge>
            </div>
          </div>

          <ScrollArea className="flex-1 max-h-96">
            {!showIndividualCards ? (
              <div className="space-y-2">
                {Object.entries(groupedFlashcards).map(([folderId, folderCards]) => {
                  const FolderIcon = getFolderIcon(folderId);
                  const folderType = getFolderType(folderId);
                  
                  return (
                    <div key={folderId} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                      <Checkbox
                        checked={selectedFolders.includes(folderId)}
                        onCheckedChange={() => handleFolderToggle(folderId)}
                      />
                      <FolderIcon className="h-4 w-4 text-gray-500" />
                      <div className="flex-1">
                        <div className="font-medium">{folderId}</div>
                        <div className="text-sm text-gray-500">
                          {folderCards.length} cards • {folderType}
                        </div>
                      </div>
                      <Badge variant="outline">{folderCards.length}</Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {flashcards.map((card) => (
                  <div key={card.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      checked={selectedIndividualCards.includes(card.id)}
                      onCheckedChange={() => handleIndividualCardToggle(card.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{card.front_content}</div>
                      <div className="text-xs text-gray-500 truncate mt-1">{card.back_content}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">Level {card.difficulty_level}</Badge>
                        {card.times_reviewed > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {Math.round((card.times_correct / card.times_reviewed) * 100)}% correct
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={selectedCards.length === 0}
          >
            Start Studying ({selectedCards.length} cards)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FlashcardSelectionModal;
