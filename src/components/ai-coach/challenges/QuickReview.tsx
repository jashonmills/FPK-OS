import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, ArrowRight, Check } from 'lucide-react';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useChallengeAnalytics } from '@/hooks/useChallengeAnalytics';

interface QuickReviewProps {
  flashcards?: any[];
  customCards?: any[];
}

const QuickReview: React.FC<QuickReviewProps> = ({ customCards }) => {
  const { flashcards, isLoading, updateFlashcard } = useFlashcards();
  const { trackChallengeStart, trackChallengeComplete } = useChallengeAnalytics();
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [reviewCards, setReviewCards] = useState<any[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  useEffect(() => {
    if (customCards && customCards.length > 0) {
      // Use custom cards when provided
      setReviewCards(customCards);
      console.log('📚 QuickReview: Using custom cards:', customCards.length);
    } else if (flashcards && flashcards.length > 0) {
      // Randomly select 3 cards when no custom cards
      const shuffled = [...flashcards].sort(() => 0.5 - Math.random());
      setReviewCards(shuffled.slice(0, 3));
      console.log('📚 QuickReview: Using random cards:', 3);
    }
  }, [flashcards, customCards]);

  // Track challenge start when cards are ready and first shown
  useEffect(() => {
    if (reviewCards.length > 0 && !completed && !hasTrackedStart) {
      // const mode = customCards && customCards.length > 0 ? 'custom' : 'random';
      // trackChallengeStart('quick_review', mode, reviewCards.length);
      setStartTime(Date.now());
      setHasTrackedStart(true);
    }
  }, [reviewCards, completed, hasTrackedStart, customCards]);

  const handleNext = async () => {
    // Update review stats for current card
    const currentCardData = reviewCards[currentCard];
    if (currentCardData) {
      await updateFlashcard({
        id: currentCardData.id,
        times_reviewed: currentCardData.times_reviewed + 1,
        last_reviewed_at: new Date().toISOString()
      });
    }

    if (currentCard < reviewCards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    } else {
      setCompleted(true);
      
      // Track completion - temporarily disabled
      // const mode = customCards && customCards.length > 0 ? 'custom' : 'random';
      // const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : 60;
      // await trackChallengeComplete(
      //   'quick_review',
      //   mode,
      //   reviewCards.length,
      //   reviewCards.length, // All cards are considered "correct" for quick review
      //   timeTaken,
      //   startTime
      // );
    }
  };

  const handleRestart = () => {
    setCurrentCard(0);
    setShowAnswer(false);
    setCompleted(false);
    setHasTrackedStart(false);
    setStartTime(null);
    
    // Re-select cards based on mode
    if (customCards && customCards.length > 0) {
      setReviewCards(customCards);
    } else if (flashcards && flashcards.length > 0) {
      const shuffled = [...flashcards].sort(() => 0.5 - Math.random());
      setReviewCards(shuffled.slice(0, 3));
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Quick Review
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!flashcards || flashcards.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="p-6 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Flashcards Found</h3>
          <p className="text-muted-foreground">Create some flashcards first to start reviewing!</p>
        </CardContent>
      </Card>
    );
  }

  if (reviewCards.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="p-6 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Loading review cards...</p>
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
          <p className="text-green-700 mb-4">You've reviewed {reviewCards.length} flashcards</p>
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
            {customCards && customCards.length > 0 && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Custom Set</span>
            )}
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {currentCard + 1} of {reviewCards.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Question</h4>
          <p>{card.front_content}</p>
        </div>

        {showAnswer && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium mb-2 text-blue-800">Answer</h4>
            <p className="text-blue-700">{card.back_content}</p>
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
