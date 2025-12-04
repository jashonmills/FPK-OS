import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Trophy, Target, RefreshCw } from 'lucide-react';

interface FinalQuestion {
  id: string;
  question: string;
  options: string[];
  correct: string;
  guidance: string;
}

const finalQuestions: FinalQuestion[] = [
  {
    id: "final1",
    question: "What is the scientific term for the brain's ability to reorganize itself by forming new neural connections?",
    options: ["Neuro-linguistics", "Neuroplasticity", "Cognitive dissonance"],
    correct: "Neuroplasticity",
    guidance: "The term is a combination of a word for 'nerves' and a word for 'malleable' or 'changeable'."
  },
  {
    id: "final2",
    question: "What is the primary effect of calming the nervous system before reading?",
    options: ["Enhancing the fight-or-flight response", "Priming the brain for learning", "Improving your memory of the story"],
    correct: "Priming the brain for learning",
    guidance: "The lesson mentions that the opposite of a stressed state is a receptive state. What does that receptive state allow your brain to do?"
  },
  {
    id: "final3",
    question: "The practice of letting children create their own stories from pictures is an example of what learning principle?",
    options: ["Rote memorization", "Cognitive scaffolding", "Passive learning"],
    correct: "Cognitive scaffolding",
    guidance: "This method involves providing a framework (the pictures and book) for the child to build their own understanding, which helps them learn a task they couldn't do alone. What is this concept of supportive learning called?"
  },
  {
    id: "final4",
    question: "What is the key benefit of incorporating reading into a wind-down routine?",
    options: ["Increased reading speed", "Better sleep and calmness", "Improved social skills"],
    correct: "Better sleep and calmness",
    guidance: "The lesson contrasts reading with other high-stimulus activities. What is the direct effect of a low-stimulus activity like reading on the nervous system?"
  }
];

export const ReadingFinalTestLesson: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const submitTest = () => {
    let correctAnswers = 0;
    finalQuestions.forEach(question => {
      if (answers[question.id] === question.correct) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setIsSubmitted(true);
  };

  const resetTest = () => {
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  const getScoreColor = () => {
    const percentage = (score / finalQuestions.length) * 100;
    if (percentage >= 75) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    const percentage = (score / finalQuestions.length) * 100;
    if (percentage >= 75) return 'Excellent! You have a strong understanding of the core principles.';
    if (percentage >= 50) return 'Good work! Review the areas you missed and try again.';
    return 'Keep practicing! Review the lessons and retake the test.';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Target className="h-6 w-6 text-primary" />
            Final Test: Test Your Knowledge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Congratulations on completing the Deep Dive! Answer the following questions to test your overall understanding of the core principles.
          </p>
        </CardContent>
      </Card>

      {!isSubmitted ? (
        <>
          {finalQuestions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {index + 1}. {question.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <label
                      key={option}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                        answers[question.id] === option
                          ? 'bg-primary/5 border-primary/20'
                          : 'bg-muted hover:bg-muted/80 border-border'
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={() => handleAnswerSelect(question.id, option)}
                        className="sr-only"
                      />
                      <span className="flex-1">{option}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="text-center">
            <Button
              onClick={submitTest}
              disabled={Object.keys(answers).length !== finalQuestions.length}
              className="px-8 py-3"
            >
              Submit Test
            </Button>
          </div>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-primary" />
              Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              <div>
                <p className={`text-4xl font-bold ${getScoreColor()}`}>
                  {score} / {finalQuestions.length}
                </p>
                <p className="text-lg text-muted-foreground">
                  {Math.round((score / finalQuestions.length) * 100)}% Correct
                </p>
              </div>

              <p className="text-lg">{getScoreMessage()}</p>

              {score === finalQuestions.length && (
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <p className="text-green-700 font-semibold text-lg">
                    Perfect Score! 🎉
                  </p>
                  <p className="text-green-600">
                    You've mastered all the core principles of effective reading. Well done!
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Detailed Results:</h3>
                {finalQuestions.map((question, index) => {
                  const userAnswer = answers[question.id];
                  const isCorrect = userAnswer === question.correct;
                  
                  return (
                    <div key={question.id} className="text-left">
                      <div className={`p-4 rounded-lg border ${
                        isCorrect 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <p className="font-medium mb-2">
                          {index + 1}. {question.question}
                        </p>
                        <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                          Your answer: {userAnswer}
                          {!isCorrect && (
                            <>
                              <br />
                              Correct answer: {question.correct}
                              <br />
                              <span className="text-xs">{question.guidance}</span>
                            </>
                          )}
                        </p>
                        {isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-green-600 mt-2" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                onClick={resetTest}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retake Test
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};