
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight, Check } from 'lucide-react';

interface QuickReviewProps {
  flashcards?: any[];
}

const QuickReview: React.FC<QuickReviewProps> = ({ flashcards = [] }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);

  const reviewCards = flashcards.slice(0, 3);

  const handleNext = () => {
    if (currentCard < reviewCards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentCard(0);
    setShowAnswer(false);
    setCompleted(false);
  };

  if (reviewCards.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="p-6 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No flashcards available for review</p>
        </CardContent>
      </Card>
    );
  }

  if (completed) {
    return (
      <Card className="h-full bg-green-50 border-green-200">
        <CardContent className="p-6 text-center">
          <Check className="h-12 w-12 mx-auto text-green-600 mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">Quick Review Complete!</h3>
          <p className="text-green-700 mb-4">You've reviewed 3 flashcards</p>
          <Button onClick={handleRestart} variant="outline">
            Review Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const card = reviewCards[currentCard];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Quick Review
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {currentCard + 1} of {reviewCards.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Question</h4>
          <p>{card?.front || 'Sample question'}</p>
        </div>

        {showAnswer && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium mb-2 text-blue-800">Answer</h4>
            <p className="text-blue-700">{card?.back || 'Sample answer'}</p>
          </div>
        )}

        <div className="flex gap-2">
          {!showAnswer ? (
            <Button onClick={() => setShowAnswer(true)} className="flex-1">
              Show Answer
            </Button>
          ) : (
            <Button onClick={handleNext} className="flex-1">
              {currentCard < reviewCards.length - 1 ? (
                <>
                  Next Card <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                'Complete Review'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickReview;
