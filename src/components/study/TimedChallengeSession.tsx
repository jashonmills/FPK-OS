
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useFlashcards } from '@/hooks/useFlashcards';
import { Clock, Check, X } from 'lucide-react';
import type { StudySession } from '@/hooks/useStudySessions';
import type { Flashcard } from '@/hooks/useFlashcards';

interface TimedChallengeSessionProps {
  session: StudySession;
  flashcards: Flashcard[];
  onComplete: () => void;
}

const TimedChallengeSession: React.FC<TimedChallengeSessionProps> = ({
  session,
  flashcards,
  onComplete
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per card
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [startTime] = useState(Date.now());
  const { completeSession } = useStudySessions();
  const { updateFlashcard } = useFlashcards();

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + (answers.length > currentIndex ? 1 : 0)) / flashcards.length) * 100;

  useEffect(() => {
    if (timeLeft > 0 && !showResult && currentIndex < flashcards.length) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp();
    }
  }, [timeLeft, showResult, currentIndex]);

  useEffect(() => {
    setTimeLeft(30);
    setUserAnswer('');
    setShowResult(false);
  }, [currentIndex]);

  const handleTimeUp = () => {
    handleAnswer(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || showResult) return;
    
    const isCorrect = checkAnswer(userAnswer.trim(), currentCard.back_content);
    handleAnswer(isCorrect);
  };

  const checkAnswer = (userInput: string, correctAnswer: string) => {
    const normalize = (str: string) => str.toLowerCase().trim().replace(/[^\w\s]/g, '');
    const normalizedUser = normalize(userInput);
    const normalizedCorrect = normalize(correctAnswer);
    
    // Exact match or contains the key terms
    return normalizedUser === normalizedCorrect || 
           normalizedCorrect.includes(normalizedUser) ||
           normalizedUser.includes(normalizedCorrect);
  };

  const handleAnswer = (isCorrect: boolean) => {
    setShowResult(true);
    
    const newAnswers = [...answers];
    newAnswers[currentIndex] = isCorrect;
    setAnswers(newAnswers);

    // Update flashcard statistics
    updateFlashcard({
      id: currentCard.id,
      times_reviewed: currentCard.times_reviewed + 1,
      times_correct: isCorrect ? currentCard.times_correct + 1 : currentCard.times_correct,
      last_reviewed_at: new Date().toISOString()
    });

    // Move to next card or complete session
    setTimeout(() => {
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        handleComplete(newAnswers);
      }
    }, 2000);
  };

  const handleComplete = (finalAnswers: boolean[]) => {
    const correctCount = finalAnswers.filter(Boolean).length;
    const incorrectCount = finalAnswers.length - correctCount;
    const duration = Math.round((Date.now() - startTime) / 1000);

    completeSession({
      id: session.id,
      correct_answers: correctCount,
      incorrect_answers: incorrectCount,
      session_duration_seconds: duration
    });

    setTimeout(onComplete, 1000);
  };

  if (currentIndex >= flashcards.length && answers.length === flashcards.length) {
    const correctCount = answers.filter(Boolean).length;
    const accuracy = Math.round((correctCount / answers.length) * 100);
    const totalTime = Math.round((Date.now() - startTime) / 1000);

    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="mb-6">
              <div className="text-4xl mb-4">⚡</div>
              <h2 className="text-2xl font-bold mb-2">Challenge Complete!</h2>
              <p className="text-gray-600">You beat the clock!</p>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-900">{answers.length}</div>
                <div className="text-sm text-blue-700">Cards</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-900">{correctCount}</div>
                <div className="text-sm text-green-700">Correct</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-900">{accuracy}%</div>
                <div className="text-sm text-purple-700">Accuracy</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-900">{totalTime}s</div>
                <div className="text-sm text-orange-700">Time</div>
              </div>
            </div>

            <Button onClick={onComplete} className="w-full">
              Return to Notes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const timePercentage = (timeLeft / 30) * 100;
  const isLowTime = timeLeft <= 10;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold">Timed Challenge</h1>
          <div className={`flex items-center gap-2 ${isLowTime ? 'text-red-600' : 'text-gray-600'}`}>
            <Clock className="h-4 w-4" />
            <span className="font-mono text-lg">{timeLeft}s</span>
          </div>
        </div>
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <Progress 
            value={timePercentage} 
            className={`h-1 ${isLowTime ? 'bg-red-100' : 'bg-orange-100'}`}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Question {currentIndex + 1} of {flashcards.length}
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="text-sm text-gray-500 mb-2">Question</div>
            <div className="text-lg font-medium leading-relaxed">
              {currentCard?.front_content}
            </div>
          </div>

          {!showResult ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="text-center text-lg"
                autoFocus
                disabled={timeLeft === 0}
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={!userAnswer.trim() || timeLeft === 0}
              >
                Submit Answer
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg text-center ${
                answers[currentIndex] ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'
              }`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  {answers[currentIndex] ? (
                    <>
                      <Check className="h-5 w-5" />
                      <span className="font-medium">Correct!</span>
                    </>
                  ) : (
                    <>
                      <X className="h-5 w-5" />
                      <span className="font-medium">Incorrect</span>
                    </>
                  )}
                </div>
                <div className="text-sm mb-2">Your answer: "{userAnswer || 'No answer'}"</div>
                <div className="text-sm">Correct answer: "{currentCard?.back_content}"</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimedChallengeSession;
