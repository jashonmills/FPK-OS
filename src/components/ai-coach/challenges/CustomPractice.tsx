
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckSquare, ArrowRight, Check, RotateCcw } from 'lucide-react';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useChallengeAnalytics } from '@/hooks/useChallengeAnalytics';

import { Flashcard } from '@/hooks/useFlashcards';

interface CustomPracticeProps {
  selectedCards: Flashcard[];
}

const CustomPractice: React.FC<CustomPracticeProps> = ({ selectedCards }) => {
  const { updateFlashcard } = useFlashcards();
  const { trackChallengeStart, trackChallengeComplete } = useChallengeAnalytics();
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  useEffect(() => {
    // Reset state when new cards are selected
    setCurrentCard(0);
    setShowAnswer(false);
    setCompleted(false);
    setHasTrackedStart(false);
    setStartTime(null);
    console.log('📋 CustomPractice: Cards selected:', selectedCards.length);
  }, [selectedCards]);

  // Track challenge start when cards are ready and first shown
  useEffect(() => {
    if (selectedCards.length > 0 && !completed && !hasTrackedStart) {
      // trackChallengeStart('custom_practice', 'custom', selectedCards.length);
      setStartTime(Date.now());
      setHasTrackedStart(true);
    }
  }, [selectedCards, completed, hasTrackedStart]);

  const handleNext = async () => {
    // Update review stats for current card
    const currentCardData = selectedCards[currentCard];
    if (currentCardData) {
      await updateFlashcard({
        id: currentCardData.id,
        times_reviewed: currentCardData.times_reviewed + 1,
        last_reviewed_at: new Date().toISOString()
      });
    }

    if (currentCard < selectedCards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    } else {
      setCompleted(true);
      
      // Track completion - temporarily disabled
      // const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : 60;
      // await trackChallengeComplete(
      //   'custom_practice',
      //   'custom',
      //   selectedCards.length,
      //   selectedCards.length, // All cards are considered "correct" for custom practice
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
  };

  if (selectedCards.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="p-6 text-center">
          <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Cards Selected</h3>
          <p className="text-muted-foreground mb-4">
            Click "Custom Practice" again to select flashcards for your custom study session.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (completed) {
    return (
      <Card className="h-full bg-green-50 border-green-200">
        <CardContent className="p-6 text-center">
          <Check className="h-12 w-12 mx-auto text-green-600 mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">Custom Practice Complete!</h3>
          <p className="text-green-700 mb-4">You've reviewed {selectedCards.length} flashcards</p>
          <Button onClick={handleRestart} variant="outline" className="mr-2">
            <RotateCcw className="h-4 w-4 mr-2" />
            Review Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const card = selectedCards[currentCard];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Custom Practice
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {currentCard + 1} of {selectedCards.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            📚 Reviewing your selected flashcards
          </p>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Question</h4>
          <p>{card.front_content}</p>
        </div>

        {showAnswer && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium mb-2 text-green-800">Answer</h4>
            <p className="text-green-700">{card.back_content}</p>
          </div>
        )}

        <div className="flex gap-2">
          {!showAnswer ? (
            <Button onClick={() => setShowAnswer(true)} className="flex-1">
              Show Answer
            </Button>
          ) : (
            <Button onClick={handleNext} className="flex-1">
              {currentCard < selectedCards.length - 1 ? (
                <>
                  Next Card <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                'Complete Practice'
              )}
            </Button>
          )}
        </div>

        {/* Progress indicator */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((currentCard + (showAnswer ? 1 : 0)) / selectedCards.length) * 100}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomPractice;
