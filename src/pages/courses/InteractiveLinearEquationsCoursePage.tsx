import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ArrowLeft, ArrowRight, CheckCircle, Play, BookOpen, Calculator, Loader2, Target } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Import static visual aids
import conceptBalanceScale from '@/assets/linear-equations/concept-balance-scale.jpg';
import stepByStepSolution from '@/assets/linear-equations/step-by-step-solution.jpg';
import algebraicTiles from '@/assets/linear-equations/algebraic-tiles.jpg';
import numberLine from '@/assets/linear-equations/number-line.jpg';
import conceptOverview from '@/assets/linear-equations/concept-overview.jpg';
import practiceExamples from '@/assets/linear-equations/practice-examples.jpg';

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

// This will be populated with real content from the lesson files
let COURSE_DATA = {
  id: 'interactive-linear-equations',
  title: 'Interactive Linear Equations',
  description: 'Master solving linear equations through interactive lessons and practice problems',
  estimatedTime: '3-4 hours',
  difficulty: 'Beginner',
  lessons: [] as Lesson[]
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load real course content on component mount
  useEffect(() => {
    const loadCourseContent = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke('fetch-linear-equations-content');
        
        if (error) {
          throw error;
        }

        if (data && data.success) {
          // Update course data with real content
          COURSE_DATA = {
            ...COURSE_DATA,
            description: data.courseSummary || COURSE_DATA.description,
            lessons: data.lessons.map((lessonData: any, index: number) => ({
              id: lessonData.id,
              title: lessonData.title,
              description: `Lesson ${index + 1} content`,
              estimatedTime: estimateReadingTime(lessonData.content),
              blocks: lessonData.blocks.map((block: any, blockIndex: number) => ({
                id: `${lessonData.id}-block-${blockIndex}`,
                type: block.type,
                title: block.title || `Section ${blockIndex + 1}`,
                content: block.content
              }))
            }))
          };
          
          setLoading(false);
        } else {
          throw new Error('Failed to load course content');
        }
      } catch (err) {
        console.error('Error loading course content:', err);
        setError('Failed to load course content. Please try again.');
        setLoading(false);
      }
    };

    loadCourseContent();
  }, []);

  // Helper function to estimate reading time
  const estimateReadingTime = (content: string): string => {
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / 200); // Assuming 200 words per minute
    return `${minutes} min`;
  };

  // Don't access lesson data if still loading
  const currentLesson = COURSE_DATA.lessons[currentLessonIndex];
  const currentBlock = currentLesson?.blocks[currentBlockIndex];
  const totalLessons = COURSE_DATA.lessons.length;
  const progressPercentage = (completedLessons.length / totalLessons) * 100;

  const canGoPrevious = currentLessonIndex > 0 || currentBlockIndex > 0;
  const canGoNext = currentLesson && (currentLessonIndex < totalLessons - 1 || currentBlockIndex < currentLesson.blocks.length - 1);
  const isLastBlock = currentLesson && currentBlockIndex === currentLesson.blocks.length - 1;

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
    if (!currentBlock) return null;

    switch (currentBlock.type) {
      case 'text':
        return (
          <div className="space-y-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {currentBlock.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none space-y-4">
                  {currentBlock.content.split('\n\n').map((paragraph, index) => (
                    <div key={index} className="space-y-2">
                      {paragraph.split('\n').map((line, lineIndex) => {
                        // Handle mathematical expressions
                        if (line.includes('=') && (line.includes('x') || line.includes('y'))) {
                          return (
                            <div key={lineIndex} className="bg-muted p-3 rounded-lg font-mono text-center">
                              {line}
                            </div>
                          );
                        }
                        // Handle bullet points
                        if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                          return (
                            <li key={lineIndex} className="ml-4">
                              {line.replace(/^[•\-]\s*/, '')}
                            </li>
                          );
                        }
                        // Regular text
                        return line.trim() ? (
                          <p key={lineIndex} className="mb-2 last:mb-0">
                            {line}
                          </p>
                        ) : null;
                      })}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Static visual aids for all text blocks */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Concept Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={conceptOverview}
                    alt="Linear equation concepts visualization"
                    className="w-full h-48 object-cover rounded-lg"
                    loading="lazy"
                  />
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Balance Scale Model</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={conceptBalanceScale}
                    alt="Balance scale equation model"
                    className="w-full h-48 object-cover rounded-lg"
                    loading="lazy"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'example':
        return (
          <div className="space-y-6">
            <Card className="w-full border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Calculator className="w-5 h-5" />
                  {currentBlock.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentBlock.content.split('\n\n').map((section, index) => (
                    <div key={index} className="space-y-2">
                      {section.split('\n').map((line, lineIndex) => {
                        // Handle mathematical expressions
                        if (line.includes('=') && (line.includes('x') || line.includes('y'))) {
                          return (
                            <div key={lineIndex} className="bg-white p-4 rounded-lg border font-mono text-center text-lg">
                              {line}
                            </div>
                          );
                        }
                        // Handle step indicators
                        if (line.toLowerCase().includes('step')) {
                          return (
                            <h4 key={lineIndex} className="font-semibold text-blue-800 mt-3">
                              {line}
                            </h4>
                          );
                        }
                        return line.trim() ? (
                          <p key={lineIndex} className="text-gray-700">
                            {line}
                          </p>
                        ) : null;
                      })}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Static visual aids for example problems */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Step-by-Step Solution</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={stepByStepSolution}
                    alt="Step-by-step solution process"
                    className="w-full h-40 object-cover rounded-lg"
                    loading="lazy"
                  />
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Balance Scale Model</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={conceptBalanceScale}
                    alt="Equation balance visualization"
                    className="w-full h-40 object-cover rounded-lg"
                    loading="lazy"
                  />
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Number Line Solution</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={numberLine}
                    alt="Solution on number line"
                    className="w-full h-40 object-cover rounded-lg"
                    loading="lazy"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'practice':
        return (
          <div className="space-y-6">
            <Card className="w-full border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Calculator className="w-5 h-5" />
                  {currentBlock.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentBlock.content.split('\n').map((line, index) => {
                    if (line.trim()) {
                      return (
                        <div key={index} className="p-4 bg-white rounded-lg border border-green-200">
                          <p className="font-medium">{line}</p>
                          <Input 
                            type="text" 
                            placeholder="Your solution..." 
                            className="mt-2"
                          />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </CardContent>
            </Card>
            
            {/* Static practice-focused visual aids */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Algebraic Tiles</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={algebraicTiles}
                    alt="Algebraic tiles representation"
                    className="w-full h-40 object-cover rounded-lg"
                    loading="lazy"
                  />
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Practice Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={practiceExamples}
                    alt="Practice problem examples"
                    className="w-full h-40 object-cover rounded-lg"
                    loading="lazy"
                  />
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Solution Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={stepByStepSolution}
                    alt="Solution method visualization"
                    className="w-full h-40 object-cover rounded-lg"
                    loading="lazy"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'quiz':
        const questions = QUIZ_QUESTIONS[currentBlock.id] || [];
        const isSubmitted = quizSubmitted[currentBlock.id];

        return (
          <div className="space-y-6">
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
            
            {/* Static visual aids for quiz blocks */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Concept Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={conceptOverview}
                    alt="Quiz concepts review"
                    className="w-full h-48 object-cover rounded-lg"
                    loading="lazy"
                  />
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Solution Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={numberLine}
                    alt="Solution visualization"
                    className="w-full h-48 object-cover rounded-lg"
                    loading="lazy"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
        <Card className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading Course Content</h2>
          <p className="text-muted-foreground">Fetching your interactive lessons...</p>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Error Loading Course</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  // No lessons loaded
  if (!COURSE_DATA.lessons.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No Content Available</h2>
          <p className="text-muted-foreground">Course content is not available at the moment.</p>
        </Card>
      </div>
    );
  }

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