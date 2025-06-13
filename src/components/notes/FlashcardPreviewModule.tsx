
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFlashcardPreview } from '@/hooks/useFlashcardPreview';
import { Eye, CheckCircle, Trash2, Edit, Sparkles, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FlashcardPreviewCard from './FlashcardPreviewCard';

const FlashcardPreviewModule: React.FC = () => {
  const { 
    previewCards, 
    approveAllCards, 
    clearPreviewCards,
    hasPreviewCards 
  } = useFlashcardPreview();
  const { toast } = useToast();

  if (!hasPreviewCards) {
    return null;
  }

  const handleApproveAll = async () => {
    const approved = await approveAllCards();
    if (approved > 0) {
      toast({
        title: "✅ Cards approved!",
        description: `${approved} flashcard${approved > 1 ? 's' : ''} saved to your collection.`,
      });
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all preview cards? This action cannot be undone.')) {
      clearPreviewCards();
      toast({
        title: "🗑️ Preview cleared",
        description: "All preview cards have been deleted.",
      });
    }
  };

  const newCards = previewCards.filter(card => card.status === 'new');
  const editedCards = previewCards.filter(card => card.status === 'edited');

  return (
    <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Sparkles className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-green-900 flex items-center gap-2">
                Flashcard Preview
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  {previewCards.length} card{previewCards.length > 1 ? 's' : ''}
                </Badge>
              </CardTitle>
              <p className="text-sm text-green-700">
                Review, edit, and approve your flashcards before adding to your collection
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleApproveAll}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve All
            </Button>
            <Button
              onClick={handleClearAll}
              size="sm"
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Status Summary */}
        <div className="flex gap-3 mt-3">
          {newCards.length > 0 && (
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              <Sparkles className="h-3 w-3 mr-1" />
              {newCards.length} New
            </Badge>
          )}
          {editedCards.length > 0 && (
            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
              <Edit className="h-3 w-3 mr-1" />
              {editedCards.length} Edited
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {previewCards.map((card) => (
            <FlashcardPreviewCard 
              key={card.id} 
              card={card}
            />
          ))}
        </div>

        {/* Footer Message */}
        <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-700">
              <p className="font-medium">Ready to study!</p>
              <p>Cards remain in preview until approved. Approved cards will appear at the top of your study selection.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlashcardPreviewModule;
