import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizSectionProps {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ 
  question, 
  options, 
  correctAnswer, 
  explanation 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSubmit = () => {
    setShowFeedback(true);
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <div className="border rounded-lg p-6 my-6 bg-card">
      <h3 className="text-lg font-semibold mb-4 text-foreground">📝 {question}</h3>
      
      <div className="space-y-3 mb-4">
        {options.map((option, index) => (
          <label
            key={index}
            className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-colors ${
              selectedAnswer === option
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            } ${
              showFeedback && option === correctAnswer
                ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                : ''
            } ${
              showFeedback && selectedAnswer === option && !isCorrect
                ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                : ''
            }`}
          >
            <input
              type="radio"
              name="quiz-option"
              value={option}
              checked={selectedAnswer === option}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              disabled={showFeedback}
              className="w-4 h-4"
            />
            <span className="text-foreground">{option}</span>
            {showFeedback && option === correctAnswer && (
              <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
            )}
            {showFeedback && selectedAnswer === option && !isCorrect && (
              <XCircle className="w-5 h-5 text-red-600 ml-auto" />
            )}
          </label>
        ))}
      </div>

      {!showFeedback ? (
        <Button
          onClick={handleSubmit}
          disabled={!selectedAnswer}
          className="w-full"
        >
          Check Answer
        </Button>
      ) : (
        <div className="space-y-3">
          <div className={`p-4 rounded ${
            isCorrect 
              ? 'bg-green-50 dark:bg-green-950/30 border border-green-500' 
              : 'bg-red-50 dark:bg-red-950/30 border border-red-500'
          }`}>
            <p className={`font-semibold mb-2 ${
              isCorrect ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'
            }`}>
              {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </p>
            {explanation && (
              <p className={isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
                {explanation}
              </p>
            )}
          </div>
          <Button onClick={handleReset} variant="outline" className="w-full">
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};
