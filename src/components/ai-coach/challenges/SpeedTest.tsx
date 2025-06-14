
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Timer, Check } from 'lucide-react';

interface SpeedTestProps {
  flashcards?: any[];
}

const SpeedTest: React.FC<SpeedTestProps> = ({ flashcards = [] }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isActive, setIsActive] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [answeredCards, setAnsweredCards] = useState(0);

  const testCards = flashcards.slice(0, 5);

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
  };

  const handleNext = () => {
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
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (testCards.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="p-6 text-center">
          <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No flashcards available for speed test</p>
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
          <Button onClick={startTest} className="bg-blue-600 hover:bg-blue-700">
            <Timer className="h-4 w-4 mr-2" />
            Start Speed Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (completed) {
    const timeUsed = 120 - timeLeft;
    const avgTimePerCard = timeUsed / answeredCards;

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
          <p>{card?.front || 'Sample question'}</p>
        </div>

        {showAnswer && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium mb-2 text-green-800">Answer</h4>
            <p className="text-green-700 mb-4">{card?.back || 'Sample answer'}</p>
            <Button onClick={handleNext} className="w-full">
              {currentCard < testCards.length - 1 ? 'Next Card' : 'Finish Test'}
            </Button>
          </div>
        )}

        {!showAnswer && (
          <Button onClick={() => setShowAnswer(true)} className="w-full">
            Show Answer
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SpeedTest;
