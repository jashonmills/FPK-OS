import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ArrowLeft, ArrowRight, CheckCircle, Play, BookOpen, Calculator } from 'lucide-react';
import { toast } from 'sonner';

interface LessonBlock {
  id: string;
  type: 'text' | 'example' | 'practice' | 'quiz';
  content: string;
  title?: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  blocks: LessonBlock[];
  estimatedTime: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  type: 'multiple-choice' | 'numeric' | 'text';
  explanation: string;
}

const COURSE_DATA = {
  id: 'interactive-linear-equations',
  title: 'Interactive Linear Equations',
  description: 'Master solving linear equations through interactive lessons and practice problems',
  estimatedTime: '3-4 hours',
  difficulty: 'Beginner',
  lessons: [
    {
      id: 'lesson-1',
      title: 'Introduction to Linear Equations',
      description: 'Learn what linear equations are and their basic properties',
      estimatedTime: '25 min',
      blocks: [
        {
          id: 'text-1',
          type: 'text',
          title: 'What is a Linear Equation?',
          content: 'A linear equation is an algebraic equation where each term is either a constant or the product of a constant and a single variable. Linear equations have no exponents higher than 1 and create straight lines when graphed.'
        },
        {
          id: 'example-1', 
          type: 'example',
          title: 'Examples of Linear Equations',
          content: '• 2x + 3 = 7\n• y = 5x - 2\n• 3a - 4 = 2a + 6\n• x/2 + 1 = 4'
        },
        {
          id: 'practice-1',
          type: 'practice',
          title: 'Identify Linear Equations',
          content: 'Which of these are linear equations?\n1. 3x + 2 = 8\n2. x² + 1 = 5\n3. 2y - 7 = 3\n4. x/3 = 4'
        }
      ]
    },
    {
      id: 'lesson-2',
      title: 'Solving One-Step Equations',
      description: 'Learn to solve simple linear equations in one step',
      estimatedTime: '30 min',
      blocks: [
        {
          id: 'text-2',
          type: 'text',
          title: 'Addition and Subtraction',
          content: 'To solve x + 5 = 12, subtract 5 from both sides:\nx + 5 - 5 = 12 - 5\nx = 7'
        },
        {
          id: 'example-2',
          type: 'example', 
          title: 'More Examples',
          content: '• x - 3 = 8 → x = 11\n• 2x = 10 → x = 5\n• x/4 = 3 → x = 12'
        },
        {
          id: 'quiz-2',
          type: 'quiz',
          title: 'Practice Problems',
          content: 'quiz'
        }
      ]
    },
    {
      id: 'lesson-3',
      title: 'Solving Two-Step Equations',
      description: 'Master equations that require multiple operations',
      estimatedTime: '35 min',
      blocks: [
        {
          id: 'text-3',
          type: 'text',
          title: 'The Two-Step Process',
          content: 'For equations like 2x + 3 = 11:\n1. First, subtract 3 from both sides: 2x = 8\n2. Then, divide both sides by 2: x = 4'
        },
        {
          id: 'example-3',
          type: 'example',
          title: 'Step-by-Step Solution',
          content: 'Solve: 3x - 7 = 14\nStep 1: Add 7 to both sides\n3x - 7 + 7 = 14 + 7\n3x = 21\n\nStep 2: Divide both sides by 3\n3x ÷ 3 = 21 ÷ 3\nx = 7'
        }
      ]
    },
    {
      id: 'lesson-4',
      title: 'Multi-Step Equations',
      description: 'Solve complex equations with variables on both sides',
      estimatedTime: '40 min',
      blocks: [
        {
          id: 'text-4',
          type: 'text',
          title: 'Variables on Both Sides',
          content: 'When variables appear on both sides, collect like terms first:\n5x + 2 = 3x + 8\nSubtract 3x from both sides: 2x + 2 = 8\nSubtract 2 from both sides: 2x = 6\nDivide by 2: x = 3'
        }
      ]
    },
    {
      id: 'lesson-5',
      title: 'Equations with Fractions',
      description: 'Handle fractions in linear equations',
      estimatedTime: '35 min',
      blocks: [
        {
          id: 'text-5',
          type: 'text',
          title: 'Clearing Fractions',
          content: 'To solve (x/3) + 2 = 5:\nSubtract 2: x/3 = 3\nMultiply by 3: x = 9'
        }
      ]
    },
    {
      id: 'lesson-6',
      title: 'Word Problems',
      description: 'Apply linear equations to real-world situations',
      estimatedTime: '45 min',
      blocks: [
        {
          id: 'text-6',
          type: 'text',
          title: 'Setting Up Equations',
          content: 'Problem: "A number increased by 7 is 15. What is the number?"\nLet x = the unknown number\nEquation: x + 7 = 15\nSolution: x = 8'
        }
      ]
    },
    {
      id: 'lesson-7',
      title: 'Review and Assessment',
      description: 'Test your knowledge with comprehensive problems',
      estimatedTime: '30 min',
      blocks: [
        {
          id: 'text-7',
          type: 'text',
          title: 'Course Summary',
          content: 'You have learned to solve:\n• One-step equations\n• Two-step equations\n• Multi-step equations\n• Equations with fractions\n• Word problems'
        },
        {
          id: 'quiz-7',
          type: 'quiz',
          title: 'Final Assessment',
          content: 'quiz'
        }
      ]
    }
  ] as Lesson[]
};

const QUIZ_QUESTIONS: { [key: string]: QuizQuestion[] } = {
  'quiz-2': [
    {
      id: 'q1',
      question: 'Solve: x + 5 = 12',
      type: 'numeric',
      correctAnswer: 7,
      explanation: 'Subtract 5 from both sides: x = 12 - 5 = 7'
    },
    {
      id: 'q2', 
      question: 'Solve: 3x = 15',
      type: 'numeric',
      correctAnswer: 5,
      explanation: 'Divide both sides by 3: x = 15 ÷ 3 = 5'
    }
  ],
  'quiz-7': [
    {
      id: 'q1',
      question: 'Solve: 2x + 3 = 11',
      type: 'numeric',
      correctAnswer: 4,
      explanation: 'First subtract 3: 2x = 8, then divide by 2: x = 4'
    },
    {
      id: 'q2',
      question: 'Solve: 5x - 7 = 3x + 5',
      type: 'numeric', 
      correctAnswer: 6,
      explanation: 'Subtract 3x from both sides: 2x - 7 = 5, add 7: 2x = 12, divide by 2: x = 6'
    }
  ]
};

const InteractiveLinearEquationsCoursePage = () => {
  const navigate = useNavigate();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useLocalStorage<string[]>('linear-equations-completed', []);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string | number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [key: string]: boolean }>({});

  const currentLesson = COURSE_DATA.lessons[currentLessonIndex];
  const currentBlock = currentLesson.blocks[currentBlockIndex];
  const totalLessons = COURSE_DATA.lessons.length;
  const progressPercentage = (completedLessons.length / totalLessons) * 100;

  const canGoPrevious = currentLessonIndex > 0 || currentBlockIndex > 0;
  const canGoNext = currentLessonIndex < totalLessons - 1 || currentBlockIndex < currentLesson.blocks.length - 1;
  const isLastBlock = currentBlockIndex === currentLesson.blocks.length - 1;

  const handlePrevious = () => {
    if (currentBlockIndex > 0) {
      setCurrentBlockIndex(currentBlockIndex - 1);
    } else if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setCurrentBlockIndex(COURSE_DATA.lessons[currentLessonIndex - 1].blocks.length - 1);
    }
  };

  const handleNext = () => {
    if (currentBlockIndex < currentLesson.blocks.length - 1) {
      setCurrentBlockIndex(currentBlockIndex + 1);
    } else if (currentLessonIndex < totalLessons - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setCurrentBlockIndex(0);
    }
  };

  const handleCompleteLesson = () => {
    if (!completedLessons.includes(currentLesson.id)) {
      setCompletedLessons([...completedLessons, currentLesson.id]);
      toast.success(`Lesson "${currentLesson.title}" completed!`);
    }
  };

  const handleQuizSubmit = (blockId: string) => {
    const questions = QUIZ_QUESTIONS[blockId] || [];
    let score = 0;
    
    questions.forEach(question => {
      const userAnswer = quizAnswers[`${blockId}-${question.id}`];
      if (userAnswer == question.correctAnswer) {
        score++;
      }
    });

    setQuizSubmitted({ ...quizSubmitted, [blockId]: true });
    toast.success(`Quiz completed! Score: ${score}/${questions.length}`);
  };

  const renderBlock = () => {
    switch (currentBlock.type) {
      case 'text':
      case 'example':
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {currentBlock.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                {currentBlock.content.split('\n').map((line, index) => (
                  <p key={index} className="mb-2 last:mb-0">
                    {line}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'practice':
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                {currentBlock.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentBlock.content.split('\n').map((line, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    {line}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'quiz':
        const questions = QUIZ_QUESTIONS[currentBlock.id] || [];
        const isSubmitted = quizSubmitted[currentBlock.id];

        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {currentBlock.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="space-y-3">
                  <Label className="text-base font-medium">
                    {index + 1}. {question.question}
                  </Label>
                  
                  <Input
                    type="number"
                    placeholder="Enter your answer"
                    value={quizAnswers[`${currentBlock.id}-${question.id}`] || ''}
                    onChange={(e) => setQuizAnswers({
                      ...quizAnswers,
                      [`${currentBlock.id}-${question.id}`]: e.target.value
                    })}
                    disabled={isSubmitted}
                    className={isSubmitted ? (
                      quizAnswers[`${currentBlock.id}-${question.id}`] == question.correctAnswer
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                    ) : ''}
                  />
                  
                  {isSubmitted && (
                    <div className="text-sm text-muted-foreground p-3 bg-muted rounded">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  )}
                </div>
              ))}
              
              {!isSubmitted && (
                <Button onClick={() => handleQuizSubmit(currentBlock.id)} className="w-full">
                  Submit Quiz
                </Button>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard/learner/courses')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
            <Badge variant="secondary">Interactive Course</Badge>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{COURSE_DATA.title}</h1>
          <p className="text-muted-foreground mb-4">{COURSE_DATA.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>📚 {totalLessons} Lessons</span>
            <span>⏱️ {COURSE_DATA.estimatedTime}</span>
            <span>📈 {COURSE_DATA.difficulty}</span>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Course Progress</span>
              <span>{completedLessons.length}/{totalLessons} lessons completed</span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </div>
        </div>

        {/* Lesson Navigation */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Lesson {currentLessonIndex + 1}: {currentLesson.title}
          </h2>
          <p className="text-muted-foreground text-sm mb-2">{currentLesson.description}</p>
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            <span className="text-sm">{currentLesson.estimatedTime}</span>
            {completedLessons.includes(currentLesson.id) && (
              <Badge variant="default" className="ml-2">
                <CheckCircle className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </div>

        {/* Block Content */}
        <div className="mb-8">
          {renderBlock()}
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={!canGoPrevious}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {isLastBlock && !completedLessons.includes(currentLesson.id) && (
              <Button onClick={handleCompleteLesson} variant="default">
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Lesson
              </Button>
            )}
            
            {canGoNext && (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Lesson List */}
        <div className="mt-12 border-t pt-8">
          <h3 className="text-lg font-semibold mb-4">All Lessons</h3>
          <div className="grid gap-3">
            {COURSE_DATA.lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  index === currentLessonIndex 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => {
                  setCurrentLessonIndex(index);
                  setCurrentBlockIndex(0);
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">
                      Lesson {index + 1}: {lesson.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{lesson.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{lesson.estimatedTime}</span>
                    {completedLessons.includes(lesson.id) && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveLinearEquationsCoursePage;