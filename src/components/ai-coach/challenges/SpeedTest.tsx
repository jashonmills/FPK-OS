
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Zap, Timer, Check } from 'lucide-react';
import { useFlashcards } from '@/hooks/useFlashcards';

interface SpeedTestProps {
  flashcards?: any[];
}

const SpeedTest: React.FC<SpeedTestProps> = () => {
  const { flashcards, isLoading, updateFlashcard } = useFlashcards();
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isActive, setIsActive] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [answeredCards, setAnsweredCards] = useState(0);
  const [testCards, setTestCards] = useState<any[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (flashcards && flashcards.length > 0) {
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
    }
  }, [flashcards]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0 && !completed) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setCompleted(true);
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, completed]);

  const startTest = () => {
    setIsActive(true);
    setStartTime(Date.now());
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleNext = async () => {
    // Update card stats
    const currentCardData = testCards[currentCard];
    if (currentCardData) {
      await updateFlashcard({
        id: currentCardData.id,
        times_reviewed: currentCardData.times_reviewed + 1,
        last_reviewed_at: new Date().toISOString()
      });
    }

    setAnsweredCards(prev => prev + 1);
    
    if (currentCard < testCards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    } else {
      setCompleted(true);
      setIsActive(false);
    }
  };

  const handleRestart = () => {
    setCurrentCard(0);
    setShowAnswer(false);
    setTimeLeft(120);
    setIsActive(false);
    setCompleted(false);
    setAnsweredCards(0);
    setStartTime(null);
    
    // Select new cards
    if (flashcards && flashcards.length > 0) {
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
            Answer {testCards.length} cards in 2 minutes!
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Cards selected: {testCards.length} (prioritizing cards not seen in 24hrs)
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

    return (
      <Card className="h-full bg-blue-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <Check className="h-12 w-12 mx-auto text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Speed Test Complete!</h3>
          <div className="space-y-2 text-blue-700 mb-4">
            <p>Cards Answered: {answeredCards}/{testCards.length}</p>
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
          <p className="text-sm text-yellow-800">⚡ Quick! Answer as fast as you can</p>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Question</h4>
          <p>{card.front_content}</p>
        </div>

        {showAnswer && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium mb-2 text-green-800">Answer</h4>
            <p className="text-green-700 mb-4">{card.back_content}</p>
            <Button onClick={handleNext} className="w-full">
              {currentCard < testCards.length - 1 ? 'Next Card' : 'Finish Test'}
            </Button>
          </div>
        )}

        {!showAnswer && (
          <Button onClick={handleShowAnswer} className="w-full">
            Show Answer
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SpeedTest;
