
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useFlashcards } from '@/hooks/useFlashcards';
import { Edit, Trash2, Save, X, ArrowLeft, ArrowRight } from 'lucide-react';

interface FlashcardReviewProps {
  onClose: () => void;
}

const FlashcardReview: React.FC<FlashcardReviewProps> = ({ onClose }) => {
  const { flashcards, updateFlashcard, deleteFlashcard } = useFlashcards();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editData, setEditData] = useState({ front_content: '', back_content: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCards = flashcards.filter(card =>
    card.front_content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.back_content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentCard = filteredCards[currentIndex];

interface Flashcard {
  id: string;
  front_content: string;
  back_content: string;
}

  const handleEdit = (card: Flashcard) => {
    setEditingCard(card.id);
    setEditData({
      front_content: card.front_content,
      back_content: card.back_content
    });
  };

  const handleSave = () => {
    if (editingCard && editData.front_content.trim() && editData.back_content.trim()) {
      updateFlashcard({
        id: editingCard,
        front_content: editData.front_content,
        back_content: editData.back_content
      });
      setEditingCard(null);
      setEditData({ front_content: '', back_content: '' });
    }
  };

  const handleCancel = () => {
    setEditingCard(null);
    setEditData({ front_content: '', back_content: '' });
  };

  const handleDelete = (cardId: string) => {
    if (confirm('Are you sure you want to delete this flashcard?')) {
      deleteFlashcard(cardId);
      if (currentIndex >= filteredCards.length - 1) {
        setCurrentIndex(Math.max(0, currentIndex - 1));
      }
    }
  };

  const handlePrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex(Math.min(filteredCards.length - 1, currentIndex + 1));
  };

  if (flashcards.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold mb-4">No Flashcards Yet</h2>
            <p className="text-gray-600 mb-6">Create some notes or upload files to generate flashcards!</p>
            <Button onClick={onClose}>Return to Notes</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Review Flashcards</h1>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
        
        <Input
          placeholder="Search flashcards..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentIndex(0);
          }}
          className="max-w-md"
        />
      </div>

      {filteredCards.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">No flashcards match your search.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{currentIndex + 1} of {filteredCards.length} flashcards</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentIndex === filteredCards.length - 1}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Flashcard Details</CardTitle>
                <div className="flex gap-2">
                  {editingCard === currentCard?.id ? (
                    <>
                      <Button size="sm" onClick={handleSave}>
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(currentCard)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDelete(currentCard.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {editingCard === currentCard?.id ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Front Content</label>
                    <textarea
                      className="w-full min-h-[100px] p-3 border border-input rounded-md resize-none"
                      value={editData.front_content}
                      onChange={(e) => setEditData({ ...editData, front_content: e.target.value })}
                      placeholder="Front content..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Back Content</label>
                    <textarea
                      className="w-full min-h-[100px] p-3 border border-input rounded-md resize-none"
                      value={editData.back_content}
                      onChange={(e) => setEditData({ ...editData, back_content: e.target.value })}
                      placeholder="Back content..."
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Front Content</div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-gray-900 leading-relaxed">{currentCard?.front_content}</p>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Back Content</div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-gray-900 leading-relaxed">{currentCard?.back_content}</p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-4 border-t">
                <Badge variant="outline">
                  Level {currentCard?.difficulty_level}
                </Badge>
                <Badge variant="outline">
                  Reviewed {currentCard?.times_reviewed} times
                </Badge>
                <Badge variant="outline">
                  {currentCard?.times_correct}/{currentCard?.times_reviewed} correct
                </Badge>
                {currentCard?.last_reviewed_at && (
                  <Badge variant="outline">
                    Last: {new Date(currentCard.last_reviewed_at).toLocaleDateString()}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default FlashcardReview;
