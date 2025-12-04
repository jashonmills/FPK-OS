import React, { useState } from 'react';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { LessonProps } from '@/types/course';

const finalQuizData = [
  {
    question: "What is the neurological benefit of handwriting over typing?",
    options: ["Increased typing speed", "Multisensory engagement leading to stronger neural pathways", "Reduced cognitive load on the brain"],
    correct: "Multisensory engagement leading to stronger neural pathways"
  },
  {
    question: "Which of the following is a technique to achieve an optimal learning state?",
    options: ["Mindful body scan", "High-intensity cardio", "Eating a sugary snack"],
    correct: "Mindful body scan"
  },
  {
    question: "The 'messiness' of initial attempts at emulation is a sign of what?",
    options: ["Lack of talent", "Poor concentration", "The brain actively mapping new motor skills"],
    correct: "The brain actively mapping new motor skills"
  },
  {
    question: "The principles of this course are best described as a foundation for what?",
    options: ["Academic writing", "Artistic pursuits", "Lifelong learning"],
    correct: "Lifelong learning"
  }
];

export const ELHandwritingFinalTestLesson: React.FC<LessonProps> = ({ onComplete }) => {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmit = () => {
    const correctAnswers = finalQuizData.reduce((count, question, index) => {
      return answers[index] === question.correct ? count + 1 : count;
    }, 0);
    
    setScore(correctAnswers);
    setSubmitted(true);
  };

  const allQuestionsAnswered = finalQuizData.every((_, index) => answers[index]);

  return (
    <InteractiveLessonWrapper
      courseId="el-handwriting"
      lessonTitle="Final Test"
      lessonId={9}
      onComplete={onComplete}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              Final Test: Test Your Knowledge
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Congratulations on completing the Deep Dive! Answer the following questions to test your overall understanding of the core principles.
            </p>
          </CardContent>
        </Card>

        {finalQuizData.map((question, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">Question {index + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold mb-4">{question.question}</p>
              <div className="space-y-2">
                {question.options.map((option) => (
                  <div key={option}>
                    <input
                      type="radio"
                      id={`q${index}-${option}`}
                      name={`question-${index}`}
                      value={option}
                      checked={answers[index] === option}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      disabled={submitted}
                    />
                    <label htmlFor={`q${index}-${option}`} className="ml-2">{option}</label>
                  </div>
                ))}
              </div>
              {submitted && (
                <div className={`mt-2 p-2 rounded ${
                  answers[index] === question.correct 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {answers[index] === question.correct 
                    ? '✓ Correct!' 
                    : `✗ Incorrect. The correct answer was: "${question.correct}"`
                  }
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardContent className="pt-6">
            {!submitted ? (
              <Button 
                onClick={handleSubmit} 
                disabled={!allQuestionsAnswered}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-3"
              >
                Submit Test
              </Button>
            ) : (
              <div className="text-center space-y-4">
                <p className={`text-xl font-bold ${score >= finalQuizData.length / 2 ? 'text-green-600' : 'text-red-600'}`}>
                  You scored {score} out of {finalQuizData.length}.
                </p>
                {score >= finalQuizData.length / 2 ? (
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                    <p className="font-semibold text-green-800">Excellent work!</p>
                    <p className="text-green-700 mt-1">
                      You've demonstrated a strong understanding of the handwriting emulation technique and its underlying principles. Keep practicing and applying these concepts!
                    </p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                    <p className="font-semibold text-yellow-800">Good effort!</p>
                    <p className="text-yellow-700 mt-1">
                      Consider reviewing the course materials to strengthen your understanding of the key concepts. Remember, learning is a process!
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </InteractiveLessonWrapper>
  );
};