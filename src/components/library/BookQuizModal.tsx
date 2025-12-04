
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Brain, Trophy, RotateCcw } from 'lucide-react';
import { useBookQuiz, QuizQuestion } from '@/hooks/useBookQuiz';
import { useCleanup } from '@/utils/cleanupManager';
import { cn } from '@/lib/utils';

interface BookQuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
  bookTitle: string;
  maxChapterIndex: number;
}

const BookQuizModal = ({ open, onOpenChange, bookId, bookTitle, maxChapterIndex }: BookQuizModalProps) => {
  const { session, loading, error, startQuiz, submitAnswer, completeQuiz, resetQuiz } = useBookQuiz();
  const cleanup = useCleanup('BookQuizModal');
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerResult, setLastAnswerResult] = useState<{ isCorrect: boolean; currentScore: number } | null>(null);
  const [quizResults, setQuizResults] = useState<any>(null);

  const handleStartQuiz = async () => {
    await startQuiz(bookId, maxChapterIndex);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !session) return;

    const result = submitAnswer(selectedAnswer);
    setLastAnswerResult(result);
    setShowFeedback(true);
    
    // Auto-advance after showing feedback
    cleanup.setTimeout(() => {
      if (session.isComplete) {
        handleCompleteQuiz();
      } else {
        setSelectedAnswer('');
        setShowFeedback(false);
        setLastAnswerResult(null);
      }
    }, 2000);
  };

  const handleCompleteQuiz = async () => {
    try {
      const results = await completeQuiz();
      setQuizResults(results);
    } catch (error) {
      console.error('Error completing quiz:', error);
    }
  };

  const handleClose = () => {
    resetQuiz();
    setSelectedAnswer('');
    setShowFeedback(false);
    setLastAnswerResult(null);
    setQuizResults(null);
    onOpenChange(false);
  };

  const currentQuestion = session?.questions[session.currentQuestionIndex];
  const progress = session ? ((session.currentQuestionIndex + 1) / session.questions.length) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Quiz: {bookTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Error State */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-red-600">{error}</p>
                <Button onClick={handleStartQuiz} className="mt-2">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quiz Start Screen */}
          {!session && !loading && !error && (
            <div className="text-center space-y-4">
              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                <Brain className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ready to test your knowledge?</h3>
                <p className="text-gray-600 mb-4">
                  This quiz covers chapters 1-{maxChapterIndex} of {bookTitle}
                </p>
                <Badge variant="secondary" className="mb-4">
                  {maxChapterIndex} {maxChapterIndex === 1 ? 'Chapter' : 'Chapters'} Available
                </Badge>
              </div>
              <Button 
                onClick={handleStartQuiz} 
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={loading}
              >
                {loading ? 'Loading Questions...' : 'Start Quiz'}
              </Button>
            </div>
          )}

          {/* Quiz Results Screen */}
          {quizResults && (
            <div className="text-center space-y-4">
              <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
                <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Quiz Complete!</h3>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {quizResults.score}/{quizResults.totalQuestions}
                    </div>
                    <p className="text-sm text-gray-600">Correct Answers</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      +{quizResults.xpAwarded}
                    </div>
                    <p className="text-sm text-gray-600">XP Earned</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Badge 
                    variant={quizResults.percentage >= 80 ? "default" : quizResults.percentage >= 60 ? "secondary" : "destructive"}
                    className="text-sm"
                  >
                    {quizResults.percentage.toFixed(0)}% Score
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleStartQuiz} variant="outline" className="flex-1">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake Quiz
                </Button>
                <Button onClick={handleClose} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          )}

          {/* Active Quiz */}
          {session && currentQuestion && !quizResults && (
            <div className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Question {session.currentQuestionIndex + 1} of {session.questions.length}</span>
                  <span>Score: {session.score}/{session.questions.length}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Question */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Badge variant="outline">Chapter {currentQuestion.chapter_index}</Badge>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium mb-4">
                        {currentQuestion.question_text}
                      </h3>

                      {/* Answer Options */}
                      <div className="grid gap-2">
                        {currentQuestion.options.map((option, index) => {
                          const isSelected = selectedAnswer === option;
                          const isCorrect = showFeedback && option === currentQuestion.correct_answer;
                          const isWrong = showFeedback && isSelected && option !== currentQuestion.correct_answer;

                          return (
                            <Button
                              key={index}
                              variant={isSelected ? "default" : "outline"}
                              className={cn(
                                "justify-start text-left h-auto p-4 transition-all",
                                isCorrect && "bg-green-100 border-green-300 text-green-800",
                                isWrong && "bg-red-100 border-red-300 text-red-800",
                                !showFeedback && isSelected && "bg-purple-100 border-purple-300"
                              )}
                              onClick={() => !showFeedback && setSelectedAnswer(option)}
                              disabled={showFeedback}
                            >
                              <div className="flex items-center gap-3 w-full">
                                <div className={cn(
                                  "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium",
                                  isCorrect && "bg-green-600 text-white",
                                  isWrong && "bg-red-600 text-white",
                                  !showFeedback && isSelected && "bg-purple-600 text-white",
                                  !showFeedback && !isSelected && "bg-gray-100 text-gray-600"
                                )}>
                                  {showFeedback ? (
                                    isCorrect ? <CheckCircle className="h-3 w-3" /> : 
                                    isWrong ? <XCircle className="h-3 w-3" /> : 
                                    String.fromCharCode(65 + index)
                                  ) : String.fromCharCode(65 + index)}
                                </div>
                                <span className="flex-1">{option}</span>
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Feedback */}
                  {showFeedback && lastAnswerResult && (
                    <div className={cn(
                      "p-4 rounded-lg border mt-4",
                      lastAnswerResult.isCorrect 
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-orange-50 border-orange-200 text-orange-800"
                    )}>
                      <div className="flex items-center gap-2">
                        {lastAnswerResult.isCorrect ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="font-medium">Correct! Well done! 🎉</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-orange-600" />
                            <span className="font-medium">
                              Not quite. The correct answer is: {currentQuestion.correct_answer}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  {!showFeedback && (
                    <div className="mt-6">
                      <Button
                        onClick={handleSubmitAnswer}
                        disabled={!selectedAnswer}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        Submit Answer
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookQuizModal;
