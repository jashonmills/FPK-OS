import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface QuizQuestion {
  questionText: string;
  options: string[];
  correctAnswer: string;
  points: number;
}

interface EnhancedQuizSectionProps {
  quizTitle: string;
  questions: QuizQuestion[];
  passingScore: number;
  feedback: {
    pass: string;
    fail: string;
  };
}

export const EnhancedQuizSection: React.FC<EnhancedQuizSectionProps> = ({
  quizTitle,
  questions,
  passingScore,
  feedback
}) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        score += q.points;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const score = showResults ? calculateScore() : 0;
  const passed = score >= passingScore;
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="quiz-section border rounded-lg p-6 my-6 bg-muted/30">
      <h3 className="text-xl font-bold mb-4 text-foreground">{quizTitle}</h3>
      
      {questions.map((question, qIndex) => (
        <div key={qIndex} className="mb-6">
          <p className="font-medium mb-3 text-foreground">{question.questionText}</p>
          <div className="space-y-2">
            {question.options.map((option, oIndex) => {
              const isCorrect = option === question.correctAnswer;
              const isSelected = answers[qIndex] === option;
              const showCorrect = showResults && isCorrect;
              const showIncorrect = showResults && isSelected && !isCorrect;
              
              return (
                <label 
                  key={oIndex}
                  className={`flex items-center p-3 border rounded cursor-pointer transition-colors ${
                    showCorrect ? 'bg-green-100 dark:bg-green-900/30 border-green-500' :
                    showIncorrect ? 'bg-red-100 dark:bg-red-900/30 border-red-500' :
                    'hover:bg-accent/50 border-border'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${qIndex}`}
                    value={option}
                    checked={isSelected}
                    onChange={() => setAnswers({ ...answers, [qIndex]: option })}
                    disabled={showResults}
                    className="mr-3"
                  />
                  <span className="text-foreground">{option}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {!showResults && (
        <Button onClick={handleSubmit} className="mt-4">
          Submit Quiz
        </Button>
      )}

      {showResults && (
        <div className={`mt-4 p-4 rounded ${
          passed 
            ? 'bg-green-100 dark:bg-green-900/30 border border-green-500' 
            : 'bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-500'
        }`}>
          <p className="font-semibold text-foreground">
            Score: {score} / {totalPoints} {passed ? '✓' : ''}
          </p>
          <p className="mt-2 text-foreground">{passed ? feedback.pass : feedback.fail}</p>
        </div>
      )}
    </div>
  );
};
