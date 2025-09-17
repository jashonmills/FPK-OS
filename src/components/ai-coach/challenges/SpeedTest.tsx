import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Zap, Timer, Check, X } from 'lucide-react';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useChallengeAnalytics } from '@/hooks/useChallengeAnalytics';
import { useCleanup } from '@/utils/cleanupManager';

import { Flashcard } from '@/hooks/useFlashcards';

interface SpeedTestProps {
  flashcards?: Flashcard[];
  customCards?: Flashcard[];
}

const SpeedTest: React.FC<SpeedTestProps> = ({ customCards }) => {
  const cleanup = useCleanup('SpeedTest');
  const { flashcards, isLoading, updateFlashcard } = useFlashcards();
  const { trackChallengeStart, trackChallengeComplete } = useChallengeAnalytics();
  const [currentCard, setCurrentCard] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isActive, setIsActive] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answeredCards, setAnsweredCards] = useState(0);
  const [testCards, setTestCards] = useState<any[]>([]);
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  // Generate multiple choice options when cards change
  useEffect(() => {
    if (testCards.length > 0 && currentCard < testCards.length) {
      const currentCardData = testCards[currentCard];
      const correctAnswer = currentCardData.back_content;
      
      // Get other answers from different cards as distractors
      const otherAnswers = testCards
        .filter((_, index) => index !== currentCard)
        .map(card => card.back_content)
        .slice(0, 3);
      
      // If we don't have enough other answers, create some generic ones
      const fallbackOptions = [
        "This is not the correct answer",
        "Another incorrect option",
        "Yet another wrong choice"
      ];
      
      while (otherAnswers.length < 3) {
        otherAnswers.push(fallbackOptions[otherAnswers.length]);
      }
      
      // Combine correct answer with distractors and shuffle
      const allOptions = [correctAnswer, ...otherAnswers.slice(0, 3)];
      const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
      
      setMultipleChoiceOptions(shuffledOptions);
    }
  }, [testCards, currentCard]);

  useEffect(() => {
    if (customCards && customCards.length > 0) {
      // Use custom cards when provided (limit to 5 for speed test)
      setTestCards(customCards.slice(0, 5));
      console.log('⚡ SpeedTest: Using custom cards:', Math.min(5, customCards.length));
    } else if (flashcards && flashcards.length > 0) {
      // Filter cards not reviewed in last 24 hours
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const availableCards = flashcards.filter(card => {
        if (!card.last_reviewed_at) return true;
        return new Date(card.last_reviewed_at) < oneDayAgo;
      });

      // If fewer than 5 cards available, use any cards
      let selectedCards = availableCards.length >= 5 
        ? availableCards.sort(() => 0.5 - Math.random()).slice(0, 5)
        : flashcards.sort(() => 0.5 - Math.random()).slice(0, 5);

      setTestCards(selectedCards);
      console.log('⚡ SpeedTest: Using filtered cards:', selectedCards.length);
    }
  }, [flashcards, customCards]);

  useEffect(() => {
    let intervalId: string | null = null;
    
    if (isActive && timeLeft > 0 && !completed) {
      intervalId = cleanup.setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setCompleted(true);
      setIsActive(false);
      
      // Track completion when time runs out
      handleTimeUpCompletion();
    }

    return () => {
      if (intervalId) cleanup.cleanup(intervalId);
    };
  }, [isActive, timeLeft, completed, answeredCards, cleanup]);

  const handleTimeUpCompletion = async () => {
    // const mode = customCards && customCards.length > 0 ? 'custom' : 'random';
    // const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : 120;
    
    // await trackChallengeComplete(
    //   'speed_test',
    //   mode,
    //   testCards.length,
    //   answeredCards,
    //   timeTaken,
    //   startTime
    // );
  };

  const startTest = () => {
    setIsActive(true);
    setStartTime(Date.now());
    
    // Track challenge start - temporarily disabled
    // if (!hasTrackedStart) {
    //   const mode = customCards && customCards.length > 0 ? 'custom' : 'random';
    //   trackChallengeStart('speed_test', mode, testCards.length);
    //   setHasTrackedStart(true);
    // }
  };

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer || showResult) return; // Prevent multiple selections
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const currentCardData = testCards[currentCard];
    const isCorrect = answer === currentCardData.back_content;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    // Auto-advance after 1 second
    setTimeout(() => {
      handleNext(isCorrect);
    }, 1000);
  };

  const handleNext = async (wasCorrect?: boolean) => {
    // Update card stats
    const currentCardData = testCards[currentCard];
    if (currentCardData) {
      await updateFlashcard({
        id: currentCardData.id,
        times_reviewed: currentCardData.times_reviewed + 1,
        times_correct: wasCorrect ? currentCardData.times_correct + 1 : currentCardData.times_correct,
        last_reviewed_at: new Date().toISOString()
      });
    }

    setAnsweredCards(prev => prev + 1);
    
    if (currentCard < testCards.length - 1) {
      setCurrentCard(currentCard + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCompleted(true);
      setIsActive(false);
      
      // Track completion when all cards are answered - temporarily disabled
      // const mode = customCards && customCards.length > 0 ? 'custom' : 'random';
      // const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : (120 - timeLeft);
      
      // await trackChallengeComplete(
      //   'speed_test',
      //   mode,
      //   testCards.length,
      //   answeredCards + 1, // Include current card
      //   timeTaken,
      //   startTime
      // );
    }
  };

  const handleRestart = () => {
    setCurrentCard(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(120);
    setIsActive(false);
    setCompleted(false);
    setCorrectAnswers(0);
    setAnsweredCards(0);
    setStartTime(null);
    setHasTrackedStart(false);
    
    // Select new cards based on mode
    if (customCards && customCards.length > 0) {
      setTestCards(customCards.slice(0, 5));
    } else if (flashcards && flashcards.length > 0) {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const availableCards = flashcards.filter(card => {
        if (!card.last_reviewed_at) return true;
        return new Date(card.last_reviewed_at) < oneDayAgo;
      });

      let selectedCards = availableCards.length >= 5 
        ? availableCards.sort(() => 0.5 - Math.random()).slice(0, 5)
        : flashcards.sort(() => 0.5 - Math.random()).slice(0, 5);

      setTestCards(selectedCards);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Speed Test
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
          <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Flashcards Found</h3>
          <p className="text-muted-foreground">Create some flashcards first to start the speed test!</p>
        </CardContent>
      </Card>
    );
  }

  if (testCards.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="p-6 text-center">
          <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Loading speed test cards...</p>
        </CardContent>
      </Card>
    );
  }

  if (!isActive && !completed) {
    return (
      <Card className="h-full">
        <CardContent className="p-6 text-center">
          <Zap className="h-12 w-12 mx-auto text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Speed Test Challenge</h3>
          <p className="text-muted-foreground mb-4">
            Answer {testCards.length} multiple choice questions in 2 minutes!
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {customCards && customCards.length > 0 
              ? `Using your custom selection (${testCards.length} cards)`
              : `Cards selected: ${testCards.length} (prioritizing cards not seen in 24hrs)`
            }
          </p>
          <Button onClick={startTest} className="bg-blue-600 hover:bg-blue-700">
            <Timer className="h-4 w-4 mr-2" />
            Start Speed Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (completed) {
    const timeUsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 120 - timeLeft;
    const avgTimePerCard = answeredCards > 0 ? timeUsed / answeredCards : 0;
    const accuracy = answeredCards > 0 ? (correctAnswers / answeredCards) * 100 : 0;

    return (
      <Card className="h-full bg-blue-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <Check className="h-12 w-12 mx-auto text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Speed Test Complete!</h3>
          <div className="space-y-2 text-blue-700 mb-4">
            <p>Cards Answered: {answeredCards}/{testCards.length}</p>
            <p>Correct Answers: {correctAnswers}/{answeredCards}</p>
            <p>Accuracy: {accuracy.toFixed(1)}%</p>
            <p>Time Used: {formatTime(timeUsed)}</p>
            {answeredCards > 0 && (
              <p>Avg Time/Card: {avgTimePerCard.toFixed(1)}s</p>
            )}
            {timeLeft === 0 && (
              <p className="text-red-600 font-medium">Time's up!</p>
            )}
          </div>
          <Button onClick={handleRestart} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const card = testCards[currentCard];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Speed Test
            {customCards && customCards.length > 0 && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Custom Set</span>
            )}
          </span>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">
              {currentCard + 1} of {testCards.length}
            </span>
            <span className={`font-mono ${timeLeft <= 30 ? 'text-red-600' : 'text-blue-600'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">⚡ Quick! Choose the correct answer</p>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Question</h4>
          <p>{card.front_content}</p>
        </div>

        <div className="space-y-2">
          {multipleChoiceOptions.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === card.back_content;
            const shouldShowResult = showResult;
            
            let buttonClass = "w-full text-left p-3 border rounded-lg transition-colors ";
            
            if (shouldShowResult) {
              if (isSelected && isCorrect) {
                buttonClass += "bg-green-100 border-green-300 text-green-800";
              } else if (isSelected && !isCorrect) {
                buttonClass += "bg-red-100 border-red-300 text-red-800";
              } else if (isCorrect) {
                buttonClass += "bg-green-100 border-green-300 text-green-800";
              } else {
                buttonClass += "bg-gray-100 border-gray-300 text-gray-600";
              }
            } else {
              buttonClass += "hover:bg-blue-50 border-gray-200";
            }

            return (
              <Button
                key={index}
                variant="outline"
                className={buttonClass}
                onClick={() => handleAnswerSelect(option)}
                disabled={showResult}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{option}</span>
                  {shouldShowResult && isSelected && (
                    isCorrect ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )
                  )}
                  {shouldShowResult && !isSelected && isCorrect && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpeedTest;