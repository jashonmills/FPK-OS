import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, HelpCircle, RefreshCw } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: string;
  guidance: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "quiz1",
    question: "What is the scientific term for the brain's ability to reorganize itself by forming new neural connections?",
    options: ["Neuro-linguistics", "Neuroplasticity", "Cognitive dissonance"],
    correct: "Neuroplasticity",
    guidance: "The term is a combination of a word for 'nerves' and a word for 'malleable' or 'changeable'."
  },
  {
    id: "quiz2", 
    question: "According to the lesson, what is the key reason to prop a book up when reading?",
    options: ["To make it easier to turn pages", "To avoid a negative emotional state", "To improve physical posture"],
    correct: "To avoid a negative emotional state",
    guidance: "Think about the connection between looking down and a person's emotional state. The lesson directly addresses this."
  },
  {
    id: "quiz3",
    question: "What is the primary effect of calming the nervous system before reading?",
    options: ["Enhancing the fight-or-flight response", "Priming the brain for learning", "Improving your memory of the story"],
    correct: "Priming the brain for learning",
    guidance: "The lesson mentions that the opposite of a stressed state is a receptive state. What does that receptive state allow your brain to do?"
  },
  {
    id: "quiz4",
    question: "The practice of letting children create their own stories from pictures is an example of what learning principle?",
    options: ["Rote memorization", "Cognitive scaffolding", "Passive learning"],
    correct: "Cognitive scaffolding", 
    guidance: "This method involves providing a framework (the pictures and book) for the child to build their own understanding, which helps them learn a task they couldn't do alone. What is this concept of supportive learning called?"
  }
];

export const ReadingQuizLesson: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const checkAnswer = (questionId: string) => {
    const question = quizQuestions.find(q => q.id === questionId);
    if (!question) return;

    const selectedAnswer = answers[questionId];
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === question.correct;
    const currentAttempts = attempts[questionId] || 0;
    
    setShowResults(prev => ({ ...prev, [questionId]: true }));
    setAttempts(prev => ({ ...prev, [questionId]: currentAttempts + 1 }));
  };

  const resetQuestion = (questionId: string) => {
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      return newAnswers;
    });
    setShowResults(prev => ({ ...prev, [questionId]: false }));
    setAttempts(prev => ({ ...prev, [questionId]: 0 }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <HelpCircle className="h-6 w-6 text-primary" />
            Mini Quiz: Test Your Understanding
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Test your understanding of the key concepts from the reading course with these focused questions.
          </p>
        </CardContent>
      </Card>

      {quizQuestions.map((question, index) => {
        const selectedAnswer = answers[question.id];
        const hasResult = showResults[question.id];
        const isCorrect = selectedAnswer === question.correct;
        const questionAttempts = attempts[question.id] || 0;

        return (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                Question {index + 1}: {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <label
                      key={option}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedAnswer === option
                          ? hasResult
                            ? isCorrect && option === question.correct
                              ? 'bg-green-50 border-green-200 text-green-700'
                              : !isCorrect && option === selectedAnswer
                              ? 'bg-red-50 border-red-200 text-red-700'
                              : 'bg-muted border-border'
                            : 'bg-primary/5 border-primary/20'
                          : 'bg-muted hover:bg-muted/80 border-border'
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={selectedAnswer === option}
                        onChange={() => handleAnswerSelect(question.id, option)}
                        disabled={hasResult}
                        className="sr-only"
                      />
                      <span className="flex-1">{option}</span>
                      {hasResult && option === question.correct && (
                        <CheckCircle2 className="h-5 w-5 text-green-600 ml-2" />
                      )}
                      {hasResult && option === selectedAnswer && option !== question.correct && (
                        <XCircle className="h-5 w-5 text-red-600 ml-2" />
                      )}
                    </label>
                  ))}
                </div>

                {!hasResult ? (
                  <Button
                    onClick={() => checkAnswer(question.id)}
                    disabled={!selectedAnswer}
                    className="w-full"
                  >
                    Check Answer
                  </Button>
                ) : (
                  <div className="space-y-3">
                    {isCorrect ? (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 font-semibold flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5" />
                          Correct!
                        </p>
                      </div>
                    ) : questionAttempts >= 3 ? (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 font-semibold mb-2">
                          The correct answer was "{question.correct}".
                        </p>
                        <p className="text-red-600 text-sm">
                          <strong>Guidance:</strong> {question.guidance}
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-700 font-semibold">
                          That was a good try! You have {3 - questionAttempts} tries left.
                        </p>
                        <p className="text-yellow-600 text-sm mt-1">
                          <strong>Guidance:</strong> {question.guidance}
                        </p>
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      onClick={() => resetQuestion(question.id)}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};