
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Check, X } from 'lucide-react';

interface AccuracyChallengeProps {
  flashcards?: any[];
}

const AccuracyChallenge: React.FC<AccuracyChallengeProps> = ({ flashcards = [] }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [completed, setCompleted] = useState(false);

  const challengeCards = flashcards.slice(0, 5);
  const targetAccuracy = 90;

  const handleAnswer = (isCorrect: boolean) => {
    const newScore = {
      correct: score.correct + (isCorrect ? 1 : 0),
      total: score.total + 1
    };
    setScore(newScore);

    if (currentCard < challengeCards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentCard(0);
    setShowAnswer(false);
    setScore({ correct: 0, total: 0 });
    setCompleted(false);
  };

  if (challengeCards.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="p-6 text-center">
          <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No flashcards available for accuracy challenge</p>
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
          <p>{card?.front || 'Sample question'}</p>
        </div>

        {showAnswer && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium mb-2 text-green-800">Correct Answer</h4>
            <p className="text-green-700 mb-4">{card?.back || 'Sample answer'}</p>
            <div className="flex gap-2">
              <Button onClick={() => handleAnswer(true)} className="flex-1 bg-green-600 hover:bg-green-700">
                <Check className="h-4 w-4 mr-2" />
                I Got It Right
              </Button>
              <Button onClick={() => handleAnswer(false)} variant="outline" className="flex-1">
                <X className="h-4 w-4 mr-2" />
                I Got It Wrong
              </Button>
            </div>
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

export default AccuracyChallenge;
