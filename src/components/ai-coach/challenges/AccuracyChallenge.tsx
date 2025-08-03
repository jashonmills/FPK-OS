import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Target, Check, X } from 'lucide-react';
import { useFlashcards } from '@/hooks/useFlashcards';
// import { useChallengeAnalytics } from '@/hooks/useChallengeAnalytics';

interface AccuracyChallengeProps {
  flashcards?: any[];
  customCards?: any[];
}

const AccuracyChallenge: React.FC<AccuracyChallengeProps> = ({ customCards }) => {
  const { flashcards, isLoading, updateFlashcard } = useFlashcards();
  // const { trackChallengeStart, trackChallengeComplete } = useChallengeAnalytics();
  const [currentCard, setCurrentCard] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [completed, setCompleted] = useState(false);
  const [challengeCards, setChallengeCards] = useState<any[]>([]);
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  const targetAccuracy = 80;

  useEffect(() => {
    if (customCards && customCards.length > 0) {
      // Use custom cards when provided (limit to 5 for accuracy challenge)
      setChallengeCards(customCards.slice(0, 5));
      console.log('🎯 AccuracyChallenge: Using custom cards:', Math.min(5, customCards.length));
    } else if (flashcards && flashcards.length > 0) {
      // Filter cards with low accuracy (< 80%) or no review history
      const lowAccuracyCards = flashcards.filter(card => {
        const successRate = card.times_reviewed > 0 
          ? (card.times_correct / card.times_reviewed) * 100 
          : 0;
        return successRate < targetAccuracy || card.times_reviewed === 0;
      });

      // If we don't have enough low accuracy cards, add some random ones
      let selectedCards = [...lowAccuracyCards];
      if (selectedCards.length < 5) {
        const remainingCards = flashcards.filter(card => !selectedCards.includes(card));
        const shuffled = remainingCards.sort(() => 0.5 - Math.random());
        selectedCards = [...selectedCards, ...shuffled].slice(0, 5);
      } else {
        selectedCards = selectedCards.slice(0, 5);
      }

      setChallengeCards(selectedCards);
      console.log('🎯 AccuracyChallenge: Using filtered cards:', selectedCards.length);
    }
  }, [flashcards, customCards]);

  useEffect(() => {
    if (challengeCards.length > 0 && currentCard < challengeCards.length) {
      generateMultipleChoiceOptions();
    }
  }, [challengeCards, currentCard]);

  // Track challenge start when cards are ready and first shown
  useEffect(() => {
    if (challengeCards.length > 0 && !completed && !hasTrackedStart) {
      // const mode = customCards && customCards.length > 0 ? 'custom' : 'random';
      // trackChallengeStart('accuracy_challenge', mode, challengeCards.length);
      setStartTime(Date.now());
      setHasTrackedStart(true);
    }
  }, [challengeCards, completed, hasTrackedStart, customCards]);

  const generateMultipleChoiceOptions = () => {
    if (!challengeCards[currentCard] || !flashcards) return;

    const correctAnswer = challengeCards[currentCard].back_content;
    const otherAnswers = flashcards
      .filter(card => card.id !== challengeCards[currentCard].id)
      .map(card => card.back_content)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const allOptions = [correctAnswer, ...otherAnswers].sort(() => 0.5 - Math.random());
    setMultipleChoiceOptions(allOptions);
  };

  const handleAnswerSelect = async (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);

    const currentCardData = challengeCards[currentCard];
    const isCorrect = answer === currentCardData.back_content;

    // Update score
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    // Update card stats
    await updateFlashcard({
      id: currentCardData.id,
      times_reviewed: currentCardData.times_reviewed + 1,
      times_correct: currentCardData.times_correct + (isCorrect ? 1 : 0),
      last_reviewed_at: new Date().toISOString()
    });
  };

  const handleNext = async () => {
    if (currentCard < challengeCards.length - 1) {
      setCurrentCard(currentCard + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCompleted(true);
      
      // Track completion with final score - temporarily disabled
      // const mode = customCards && customCards.length > 0 ? 'custom' : 'random';
      // const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : 120;
      // const finalCorrect = score.correct + (selectedAnswer === challengeCards[currentCard].back_content ? 1 : 0);
      
      // await trackChallengeComplete(
      //   'accuracy_challenge',
      //   mode,
      //   challengeCards.length,
      //   finalCorrect,
      //   timeTaken,
      //   startTime
      // );
    }
  };

  const handleRestart = () => {
    setCurrentCard(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore({ correct: 0, total: 0 });
    setCompleted(false);
    setHasTrackedStart(false);
    setStartTime(null);
    
    // Regenerate challenge cards based on mode
    if (customCards && customCards.length > 0) {
      setChallengeCards(customCards.slice(0, 5));
    } else if (flashcards && flashcards.length > 0) {
      const lowAccuracyCards = flashcards.filter(card => {
        const successRate = card.times_reviewed > 0 
          ? (card.times_correct / card.times_reviewed) * 100 
          : 0;
        return successRate < targetAccuracy || card.times_reviewed === 0;
      });

      let selectedCards = [...lowAccuracyCards];
      if (selectedCards.length < 5) {
        const remainingCards = flashcards.filter(card => !selectedCards.includes(card));
        const shuffled = remainingCards.sort(() => 0.5 - Math.random());
        selectedCards = [...selectedCards, ...shuffled].slice(0, 5);
      } else {
        selectedCards = selectedCards.slice(0, 5);
      }

      setChallengeCards(selectedCards);
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Accuracy Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!flashcards || flashcards.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="p-6 text-center">
          <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Flashcards Found</h3>
          <p className="text-muted-foreground">Create some flashcards first to start the accuracy challenge!</p>
        </CardContent>
      </Card>
    );
  }

  if (challengeCards.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="p-6 text-center">
          <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Loading challenge cards...</p>
        </CardContent>
      </Card>
    );
  }

  if (completed) {
    const accuracy = Math.round((score.correct / score.total) * 100);
    const isSuccess = accuracy >= targetAccuracy;

    return (
      <Card className={`h-full ${isSuccess ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
        <CardContent className="p-6 text-center">
          {isSuccess ? (
            <Check className="h-12 w-12 mx-auto text-green-600 mb-4" />
          ) : (
            <Target className="h-12 w-12 mx-auto text-orange-600 mb-4" />
          )}
          <h3 className={`text-lg font-semibold mb-2 ${isSuccess ? 'text-green-800' : 'text-orange-800'}`}>
            {isSuccess ? 'Challenge Complete!' : 'Keep Practicing!'}
          </h3>
          <p className={`mb-4 ${isSuccess ? 'text-green-700' : 'text-orange-700'}`}>
            Accuracy: {accuracy}% ({score.correct}/{score.total})
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Target: {targetAccuracy}%+
          </p>
          <Button onClick={handleRestart} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const card = challengeCards[currentCard];
  const currentAccuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Accuracy Challenge
            {customCards && customCards.length > 0 && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Custom Set</span>
            )}
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {currentCard + 1} of {challengeCards.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="flex justify-between text-sm">
            <span>Current Accuracy: {currentAccuracy}%</span>
            <span>Target: {targetAccuracy}%+</span>
          </div>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Question</h4>
          <p>{card.front_content}</p>
        </div>

        {!showResult && (
          <div className="space-y-2">
            <h4 className="font-medium mb-2">Choose the correct answer:</h4>
            {multipleChoiceOptions.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left h-auto p-3 justify-start"
                onClick={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
              >
                {option}
              </Button>
            ))}
          </div>
        )}

        {showResult && (
          <div className={`p-4 rounded-lg border ${
            selectedAnswer === card.back_content 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {selectedAnswer === card.back_content ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <X className="h-5 w-5 text-red-600" />
              )}
              <h4 className={`font-medium ${
                selectedAnswer === card.back_content ? 'text-green-800' : 'text-red-800'
              }`}>
                {selectedAnswer === card.back_content ? 'Correct!' : 'Incorrect'}
              </h4>
            </div>
            <p className={`mb-4 ${
              selectedAnswer === card.back_content ? 'text-green-700' : 'text-red-700'
            }`}>
              Correct answer: {card.back_content}
            </p>
            <Button onClick={handleNext} className="w-full">
              {currentCard < challengeCards.length - 1 ? 'Next Question' : 'Complete Challenge'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccuracyChallenge;
