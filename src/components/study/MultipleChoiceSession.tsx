
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useFlashcards } from '@/hooks/useFlashcards';
import { Check, X } from 'lucide-react';
import type { StudySession } from '@/hooks/useStudySessions';
import type { Flashcard } from '@/hooks/useFlashcards';

interface MultipleChoiceSessionProps {
  session: StudySession;
  flashcards: Flashcard[];
  onComplete: () => void;
}

const MultipleChoiceSession: React.FC<MultipleChoiceSessionProps> = ({
  session,
  flashcards,
  onComplete
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [startTime] = useState(Date.now());
  const { completeSession } = useStudySessions();
  const { updateFlashcard } = useFlashcards();

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + (answers.length > currentIndex ? 1 : 0)) / flashcards.length) * 100;

  useEffect(() => {
    if (currentCard) {
      generateOptions();
    }
  }, [currentIndex, currentCard]);

  const generateOptions = () => {
    const correctAnswer = currentCard.back_content;
    const otherCards = flashcards.filter(card => card.id !== currentCard.id);
    
    // Get 3 random wrong answers
    const wrongAnswers = otherCards
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(card => card.back_content);
    
    // Combine and shuffle
    const allOptions = [correctAnswer, ...wrongAnswers];
    const shuffled = allOptions.sort(() => Math.random() - 0.5);
    
    setOptions(shuffled);
    setCorrectIndex(shuffled.indexOf(correctAnswer));
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === correctIndex;
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
    }, 1500);
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

    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="mb-6">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
              <p className="text-gray-600">Great job on your multiple choice test!</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-900">{answers.length}</div>
                <div className="text-sm text-blue-700">Questions</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-900">{correctCount}</div>
                <div className="text-sm text-green-700">Correct</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-900">{accuracy}%</div>
                <div className="text-sm text-purple-700">Score</div>
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold">Multiple Choice</h1>
          <span className="text-sm text-gray-600">
            {currentIndex + 1} of {flashcards.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="text-sm text-gray-500 mb-2">Question</div>
            <div className="text-lg font-medium leading-relaxed">
              {currentCard?.front_content}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {options.map((option, index) => {
          let buttonClass = "w-full text-left p-4 border rounded-lg transition-colors ";
          
          if (!showResult) {
            buttonClass += "hover:bg-gray-50 border-gray-200";
          } else {
            if (index === correctIndex) {
              buttonClass += "bg-green-100 border-green-300 text-green-900";
            } else if (index === selectedAnswer && index !== correctIndex) {
              buttonClass += "bg-red-100 border-red-300 text-red-900";
            } else {
              buttonClass += "bg-gray-50 border-gray-200 text-gray-600";
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showResult}
              className={buttonClass}
            >
              <div className="flex items-center justify-between">
                <span className="flex-1">{option}</span>
                {showResult && index === correctIndex && (
                  <Check className="h-5 w-5 text-green-600" />
                )}
                {showResult && index === selectedAnswer && index !== correctIndex && (
                  <X className="h-5 w-5 text-red-600" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MultipleChoiceSession;
