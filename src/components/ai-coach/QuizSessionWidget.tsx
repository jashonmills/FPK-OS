
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Target, RotateCcw, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuizSession, QuizCard } from '@/hooks/useQuizSession';

interface QuizSessionWidgetProps {
  onComplete?: (results: any) => void;
  onCancel?: () => void;
}

const QuizSessionWidget = ({ onComplete, onCancel }: QuizSessionWidgetProps) => {
  const {
    sessionState,
    submitAnswer,
    nextCard,
    endSession,
    getCurrentCard,
    isSessionComplete,
    progress
  } = useQuizSession();

  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    attempts: number;
    explanation?: string;
    correctAnswer?: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentCard = getCurrentCard();

  if (!sessionState.isActive || !currentCard) {
    return null;
  }

  const handleAnswerSelect = (option: 'A' | 'B' | 'C' | 'D') => {
    if (feedback) return; // Already answered
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || isSubmitting) return;

    setIsSubmitting(true);
    const result = await submitAnswer(selectedAnswer);
    if (result) {
      setFeedback(result);
    }
    setIsSubmitting(false);
  };

  const handleNextCard = () => {
    setSelectedAnswer(null);
    setFeedback(null);
    nextCard();
  };

  const handleEndSession = async () => {
    const results = await endSession();
    onComplete?.(results);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (feedback) return;
    
    const keyMap: Record<string, 'A' | 'B' | 'C' | 'D'> = {
      '1': 'A', 'a': 'A', 'A': 'A',
      '2': 'B', 'b': 'B', 'B': 'B',
      '3': 'C', 'c': 'C', 'C': 'C',
      '4': 'D', 'd': 'D', 'D': 'D'
    };

    if (keyMap[e.key]) {
      handleAnswerSelect(keyMap[e.key]);
    } else if (e.key === 'Enter' && selectedAnswer) {
      handleSubmitAnswer();
    }
  };

  // Check if this is the last card
  const isLastCard = progress.current === progress.total;

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Quiz Session
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Card {progress.current} of {progress.total}
            </span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              Difficulty: {currentCard.difficulty}/5
            </Badge>
          </div>
          <Progress value={progress.percentage} className="h-2" />
        </div>
      </CardHeader>

      <CardContent 
        className="space-y-4"
        onKeyDown={handleKeyPress}
        tabIndex={0}
      >
        {/* Question */}
        <div className="p-4 bg-white rounded-lg border border-purple-100">
          <h3 className="text-lg font-medium text-foreground mb-2">
            {currentCard.question}
          </h3>
        </div>

        {/* Multiple Choice Options */}
        <div className="grid gap-2">
          {currentCard.options.map((option, index) => {
            const optionLetter = ['A', 'B', 'C', 'D'][index] as 'A' | 'B' | 'C' | 'D';
            const isSelected = selectedAnswer === optionLetter;
            const isCorrect = feedback && currentCard.correctOption === optionLetter;
            const isIncorrect = feedback && isSelected && !isCorrect;

            return (
              <Button
                key={optionLetter}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "justify-start text-left h-auto p-3 transition-all",
                  isSelected && !feedback && "bg-purple-100 border-purple-300",
                  isCorrect && "bg-green-100 border-green-300 text-green-800",
                  isIncorrect && "bg-red-100 border-red-300 text-red-800",
                  !feedback && "hover:bg-purple-50"
                )}
                onClick={() => handleAnswerSelect(optionLetter)}
                disabled={!!feedback}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={cn(
                    "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium",
                    isSelected && !feedback && "bg-purple-600 text-white",
                    isCorrect && "bg-green-600 text-white",
                    isIncorrect && "bg-red-600 text-white",
                    !isSelected && !feedback && "bg-muted text-muted-foreground"
                  )}>
                    {isCorrect ? <CheckCircle className="h-3 w-3" /> : 
                     isIncorrect ? <XCircle className="h-3 w-3" /> : 
                     optionLetter}
                  </div>
                  <span className="flex-1">{option}</span>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={cn(
            "p-4 rounded-lg border",
            feedback.correct 
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-orange-50 border-orange-200 text-orange-800"
          )}>
            <div className="flex items-center gap-2 mb-2">
              {feedback.correct ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">
                    {feedback.attempts === 1 ? "Perfect! First try! 🎉" : "Correct! Well done! ✨"}
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-orange-600" />
                  <span className="font-medium">
                    {feedback.attempts < 2 ? "Not quite - try again! 🤔" : "Let's see the answer 📚"}
                  </span>
                </>
              )}
            </div>
            
            {feedback.explanation && (
              <p className="text-sm mt-2">
                {feedback.explanation}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {!feedback ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer || isSubmitting}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? "Checking..." : "Submit Answer"}
            </Button>
          ) : (
            <>
              {!feedback.correct && feedback.attempts < 2 ? (
                <Button
                  onClick={() => {
                    setSelectedAnswer(null);
                    setFeedback(null);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Try Again
                </Button>
              ) : isLastCard ? (
                <Button
                  onClick={handleEndSession}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Trophy className="h-4 w-4 mr-1" />
                  Complete Session
                </Button>
              ) : (
                <Button
                  onClick={handleNextCard}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  Next Card →
                </Button>
              )}
            </>
          )}
        </div>

        {/* Keyboard shortcuts hint */}
        {!feedback && (
          <p className="text-xs text-muted-foreground text-center">
            💡 Use keys 1-4 or A-D to select, Enter to submit
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizSessionWidget;
