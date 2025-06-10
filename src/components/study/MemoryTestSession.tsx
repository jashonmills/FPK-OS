
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useFlashcards } from '@/hooks/useFlashcards';
import { RotateCcw, Check, X, ArrowRight } from 'lucide-react';
import type { StudySession } from '@/hooks/useStudySessions';
import type { Flashcard } from '@/hooks/useFlashcards';

interface MemoryTestSessionProps {
  session: StudySession;
  flashcards: Flashcard[];
  onComplete: () => void;
}

const MemoryTestSession: React.FC<MemoryTestSessionProps> = ({
  session,
  flashcards,
  onComplete
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [startTime] = useState(Date.now());
  const { completeSession } = useStudySessions();
  const { updateFlashcard } = useFlashcards();

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + (answers.length > currentIndex ? 1 : 0)) / flashcards.length) * 100;

  const handleAnswer = (correct: boolean) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = correct;
    setAnswers(newAnswers);

    // Update flashcard statistics
    updateFlashcard({
      id: currentCard.id,
      times_reviewed: currentCard.times_reviewed + 1,
      times_correct: correct ? currentCard.times_correct + 1 : currentCard.times_correct,
      last_reviewed_at: new Date().toISOString()
    });

    // Move to next card or complete session
    if (currentIndex < flashcards.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      }, 500);
    } else {
      handleComplete(newAnswers);
    }
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
              <div className="text-4xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
              <p className="text-gray-600">Great job on your memory test!</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-900">{answers.length}</div>
                <div className="text-sm text-blue-700">Cards Studied</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-900">{correctCount}</div>
                <div className="text-sm text-green-700">Correct</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-900">{accuracy}%</div>
                <div className="text-sm text-purple-700">Accuracy</div>
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
          <h1 className="text-xl font-bold">Memory Test</h1>
          <span className="text-sm text-gray-600">
            {currentIndex + 1} of {flashcards.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="mb-6 min-h-[300px]">
        <CardContent className="p-8">
          <div 
            className={`relative w-full h-full cursor-pointer transition-transform duration-500 ${
              isFlipped ? 'transform rotateY-180' : ''
            }`}
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div 
              className={`absolute inset-0 backface-hidden ${!isFlipped ? 'block' : 'hidden'}`}
            >
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-4">Front</div>
                <div className="text-lg font-medium leading-relaxed">
                  {currentCard?.front_content}
                </div>
                <div className="mt-8 text-sm text-gray-400">
                  Click to reveal answer
                </div>
              </div>
            </div>
            
            <div 
              className={`absolute inset-0 backface-hidden ${isFlipped ? 'block' : 'hidden'}`}
            >
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-4">Back</div>
                <div className="text-lg leading-relaxed">
                  {currentCard?.back_content}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isFlipped && answers.length <= currentIndex && (
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => handleAnswer(false)}
          >
            <X className="h-5 w-5 mr-2" />
            Incorrect
          </Button>
          <Button
            size="lg"
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={() => handleAnswer(true)}
          >
            <Check className="h-5 w-5 mr-2" />
            Correct
          </Button>
        </div>
      )}

      {!isFlipped && (
        <div className="text-center">
          <Button variant="outline" onClick={() => setIsFlipped(true)}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Flip Card
          </Button>
        </div>
      )}
    </div>
  );
};

export default MemoryTestSession;
