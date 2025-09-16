import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, HelpCircle, Trophy } from 'lucide-react';

export function NumeracyFinalTestLesson() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [showGuidance, setShowGuidance] = useState<Record<string, boolean>>({});
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const finalQuizData = [
    {
      id: 'final-q0',
      question: 'What is the scientific term for the brain\'s ability to reorganize itself by forming new neural connections?',
      options: ['Neuro-linguistics', 'Neuroplasticity', 'Cognitive dissonance'],
      solution: 'Neuroplasticity',
      guidance: 'The term is a combination of a word for \'nerves\' and a word for \'malleable\' or \'changeable\'.'
    },
    {
      id: 'final-q1',
      question: 'What is the primary effect of calming the nervous system before numeracy practice?',
      options: ['Enhancing the fight-or-flight response', 'Priming the brain for learning', 'Improving your memory of the multiplication table'],
      solution: 'Priming the brain for learning',
      guidance: 'The lesson mentions that the opposite of a stressed state is a receptive state. What does that receptive state allow your brain to do?'
    },
    {
      id: 'final-q2',
      question: 'The ancient fact about numbers and angles is an example of what learning principle?',
      options: ['Rote memorization', 'Visual memorization', 'Passive learning'],
      solution: 'Visual memorization',
      guidance: 'This method involves associating a shape with a concrete visual, which is a powerful way for the brain to organize and retain information. What is this concept called?'
    },
    {
      id: 'final-q3',
      question: 'The Number Triangle technique is a prime example of what kind of learning?',
      options: ['Rote memorization', 'Relational learning', 'Isolated fact memorization'],
      solution: 'Relational learning',
      guidance: 'The number triangle helps you understand the connections between different arithmetic operations, rather than just learning them as isolated facts. What is this concept of connected learning called?'
    },
    {
      id: 'final-q4',
      question: 'What is the key takeaway of the course regarding metacognition?',
      options: ['Learning one skill prevents you from learning another.', 'Learning how to learn is the ultimate meta-skill.', 'Only children can effectively learn new skills.'],
      solution: 'Learning how to learn is the ultimate meta-skill.',
      guidance: 'The lesson discusses the ability to think about your own thinking. What is the overarching message about this ability?'
    }
  ];

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const checkAnswer = (questionId: string) => {
    setShowResults({ ...showResults, [questionId]: true });
  };

  const toggleGuidance = (questionId: string) => {
    setShowGuidance({ ...showGuidance, [questionId]: !showGuidance[questionId] });
  };

  const submitFinalTest = () => {
    let score = 0;
    const totalQuestions = finalQuizData.length;
    
    finalQuizData.forEach((question) => {
      if (answers[question.id] === question.solution) {
        score++;
      }
    });
    
    setFinalScore(score);
  };

  const isTestComplete = finalQuizData.every(q => answers[q.id]);

  return (
    <Card className="w-full">
      <CardContent className="p-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Trophy className="h-10 w-10 text-yellow-500" />
              Final Test
            </h1>
            <p className="text-xl text-gray-600">
              Test Your Knowledge - Comprehensive Assessment
            </p>
            <p className="text-gray-500 mt-2">
              Congratulations on completing the Deep Dive! Answer the following questions to test your overall understanding of the core principles.
            </p>
          </div>

          {finalQuizData.map((question, index) => (
            <Card key={question.id} className="border-l-4 border-purple-400 bg-purple-50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Question {index + 1}: {question.question}
                </h3>
                
                <div className="space-y-3 mb-4">
                  {question.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="form-radio h-4 w-4 text-purple-600"
                        disabled={showResults[question.id]}
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 mb-4">
                  <Button
                    onClick={() => checkAnswer(question.id)}
                    disabled={!answers[question.id] || showResults[question.id]}
                    className="flex items-center gap-2"
                  >
                    Check Answer
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => toggleGuidance(question.id)}
                    className="flex items-center gap-2"
                  >
                    <HelpCircle className="h-4 w-4" />
                    {showGuidance[question.id] ? 'Hide Guidance' : 'Show Guidance'}
                  </Button>
                </div>

                {showGuidance[question.id] && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <p className="text-gray-700 font-medium">Guidance:</p>
                    <p className="text-gray-700">{question.guidance}</p>
                  </div>
                )}

                {showResults[question.id] && (
                  <div className={`p-4 rounded-lg flex items-center gap-2 ${
                    answers[question.id] === question.solution
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {answers[question.id] === question.solution ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">Correct!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5" />
                        <span className="font-semibold">
                          Incorrect. The correct answer was: {question.solution}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <div className="text-center space-y-4">
            <Button
              onClick={submitFinalTest}
              disabled={!isTestComplete || finalScore !== null}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
            >
              Submit Final Test
            </Button>

            {finalScore !== null && (
              <div className={`mx-auto max-w-md p-6 rounded-lg border-2 ${
                finalScore >= finalQuizData.length / 2 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="text-center">
                  <Trophy className={`h-12 w-12 mx-auto mb-3 ${
                    finalScore >= finalQuizData.length / 2 ? 'text-green-500' : 'text-red-500'
                  }`} />
                  <h3 className={`text-xl font-bold ${
                    finalScore >= finalQuizData.length / 2 ? 'text-green-800' : 'text-red-800'
                  }`}>
                    Final Score: {finalScore} out of {finalQuizData.length}
                  </h3>
                  <p className={`mt-2 ${
                    finalScore >= finalQuizData.length / 2 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {finalScore >= finalQuizData.length / 2 
                      ? 'Excellent work! You have a strong understanding of the concepts.' 
                      : 'Consider reviewing the course materials to strengthen your understanding.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}