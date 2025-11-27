import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

export function NumeracyQuizLesson() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [showGuidance, setShowGuidance] = useState<Record<string, boolean>>({});

  const quizData = [
    {
      id: 'quiz1',
      question: 'What is the scientific term for the brain\'s ability to reorganize itself by forming new neural connections?',
      options: ['Neuro-linguistics', 'Neuroplasticity', 'Cognitive dissonance'],
      correct: 'Neuroplasticity',
      guidance: 'The term is a combination of a word for \'nerves\' and a word for \'malleable\' or \'changeable\'.'
    },
    {
      id: 'quiz2',
      question: 'What is the primary effect of calming the nervous system before numeracy practice?',
      options: ['Enhancing the fight-or-flight response', 'Priming the brain for learning', 'Improving your memory of the multiplication table'],
      correct: 'Priming the brain for learning',
      guidance: 'The lesson mentions that the opposite of a stressed state is a receptive state. What does that receptive state allow your brain to do?'
    },
    {
      id: 'quiz3',
      question: 'The ancient fact about numbers and angles is an example of what learning principle?',
      options: ['Rote memorization', 'Visual memorization', 'Passive learning'],
      correct: 'Visual memorization',
      guidance: 'This method involves associating a shape with a concrete visual, which is a powerful way for the brain to organize and retain information. What is this concept called?'
    },
    {
      id: 'quiz4',
      question: 'The Number Triangle technique is a prime example of what kind of learning?',
      options: ['Rote memorization', 'Relational learning', 'Isolated fact memorization'],
      correct: 'Relational learning',
      guidance: 'The number triangle helps you understand the connections between different arithmetic operations, rather than just learning them as isolated facts. What is this concept of connected learning called?'
    }
  ];

  const handleAnswerChange = (quizId: string, answer: string) => {
    setAnswers({ ...answers, [quizId]: answer });
  };

  const checkAnswer = (quizId: string) => {
    setShowResults({ ...showResults, [quizId]: true });
  };

  const toggleGuidance = (quizId: string) => {
    setShowGuidance({ ...showGuidance, [quizId]: !showGuidance[quizId] });
  };

  return (
    <Card className="w-full">
      <CardContent className="p-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Mini Quiz
            </h1>
            <p className="text-xl text-gray-600">
              Test your understanding of the key concepts
            </p>
          </div>

          {quizData.map((quiz, index) => (
            <Card key={quiz.id} className="border-l-4 border-blue-400 bg-blue-50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Question {index + 1}: {quiz.question}
                </h3>
                
                <div className="space-y-3 mb-4">
                  {quiz.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name={quiz.id}
                        value={option}
                        onChange={(e) => handleAnswerChange(quiz.id, e.target.value)}
                        className="form-radio h-4 w-4 text-blue-600"
                        disabled={showResults[quiz.id]}
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 mb-4">
                  <Button
                    onClick={() => checkAnswer(quiz.id)}
                    disabled={!answers[quiz.id] || showResults[quiz.id]}
                    className="flex items-center gap-2"
                  >
                    Check Answer
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => toggleGuidance(quiz.id)}
                    className="flex items-center gap-2"
                  >
                    <HelpCircle className="h-4 w-4" />
                    {showGuidance[quiz.id] ? 'Hide Guidance' : 'Show Guidance'}
                  </Button>
                </div>

                {showGuidance[quiz.id] && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <p className="text-gray-700 font-medium">Guidance:</p>
                    <p className="text-gray-700">{quiz.guidance}</p>
                  </div>
                )}

                {showResults[quiz.id] && (
                  <div className={`p-4 rounded-lg flex items-center gap-2 ${
                    answers[quiz.id] === quiz.correct 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {answers[quiz.id] === quiz.correct ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">Correct!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5" />
                        <span className="font-semibold">
                          Incorrect. The correct answer is: {quiz.correct}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <div className="text-center bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700">
              Complete all questions to test your understanding of the core concepts from the course.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}