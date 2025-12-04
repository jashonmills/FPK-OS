import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, HelpCircle, Calculator } from 'lucide-react';

interface PracticeQuestion {
  id: string;
  question: string;
  correctAnswer: string | number;
  hints: string[];
  explanation: string;
  type: 'text' | 'number' | 'multiple-choice';
  choices?: Array<{ id: string; text: string; isCorrect: boolean }>;
}

interface PracticeScreenProps {
  question: PracticeQuestion;
  onComplete?: (isCorrect: boolean, attempts: number) => void;
  allowMultipleAttempts?: boolean;
  maxAttempts?: number;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({
  question,
  onComplete,
  allowMultipleAttempts = true,
  maxAttempts = 3
}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const checkAnswer = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    let correct = false;
    
    if (question.type === 'multiple-choice') {
      const selectedChoiceData = question.choices?.find(c => c.id === selectedChoice);
      correct = selectedChoiceData?.isCorrect || false;
    } else {
      const userValue = question.type === 'number' ? 
        parseFloat(userAnswer) : 
        userAnswer.toLowerCase().trim();
      const correctValue = question.type === 'number' ? 
        parseFloat(question.correctAnswer.toString()) : 
        question.correctAnswer.toString().toLowerCase().trim();
      
      correct = userValue === correctValue;
    }

    setIsCorrect(correct);
    
    if (correct || newAttempts >= maxAttempts) {
      setShowExplanation(true);
      onComplete?.(correct, newAttempts);
    } else if (allowMultipleAttempts) {
      setShowHint(true);
      setCurrentHintIndex(Math.min(newAttempts - 1, question.hints.length - 1));
    }
  };

  const resetQuestion = () => {
    setUserAnswer('');
    setSelectedChoice('');
    setAttempts(0);
    setIsCorrect(null);
    setShowHint(false);
    setCurrentHintIndex(0);
    setShowExplanation(false);
  };

  const getResultIcon = () => {
    if (isCorrect === true) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (isCorrect === false) return <XCircle className="h-5 w-5 text-red-600" />;
    return <Calculator className="h-5 w-5 text-blue-600" />;
  };

  const getResultMessage = () => {
    if (isCorrect === true) return "Correct! Well done!";
    if (isCorrect === false && attempts >= maxAttempts) return "Incorrect. Let's review the solution.";
    if (isCorrect === false) return `Not quite right. You have ${maxAttempts - attempts} attempts left.`;
    return "";
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getResultIcon()}
            Practice Problem
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-foreground leading-relaxed">
            {question.question}
          </div>

          {question.type === 'multiple-choice' ? (
            <div className="space-y-2">
              {question.choices?.map((choice) => (
                <Button
                  key={choice.id}
                  variant={selectedChoice === choice.id ? "default" : "outline"}
                  className="w-full text-left justify-start"
                  onClick={() => setSelectedChoice(choice.id)}
                  disabled={showExplanation}
                >
                  {choice.text}
                </Button>
              ))}
            </div>
          ) : (
            <Input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={question.type === 'number' ? "Enter your numerical answer" : "Enter your answer"}
              disabled={showExplanation}
              className="text-lg"
            />
          )}

          {!showExplanation && (
            <div className="flex gap-2">
              <Button 
                onClick={checkAnswer}
                disabled={
                  (question.type === 'multiple-choice' && !selectedChoice) ||
                  (question.type !== 'multiple-choice' && !userAnswer.trim())
                }
                className="flex-1"
              >
                Check Answer
              </Button>
              
              {attempts > 0 && (
                <Button variant="outline" onClick={resetQuestion}>
                  Reset
                </Button>
              )}
            </div>
          )}

          {attempts > 0 && (
            <Alert className={isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <AlertDescription className="flex items-center gap-2">
                {getResultIcon()}
                <span className={isCorrect ? "text-green-700" : "text-red-700"}>
                  {getResultMessage()}
                </span>
              </AlertDescription>
            </Alert>
          )}

          {showHint && !showExplanation && question.hints.length > 0 && (
            <Alert className="border-blue-200 bg-blue-50">
              <HelpCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="text-blue-700">
                  <strong>Hint {currentHintIndex + 1}:</strong> {question.hints[currentHintIndex]}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {showExplanation && (
            <Alert className="border-purple-200 bg-purple-50">
              <AlertDescription>
                <div className="text-purple-700">
                  <strong>Explanation:</strong>
                  <div className="mt-2 leading-relaxed">
                    {question.explanation}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {attempts > 0 && (
            <div className="text-sm text-muted-foreground">
              Attempts: {attempts} / {maxAttempts}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};