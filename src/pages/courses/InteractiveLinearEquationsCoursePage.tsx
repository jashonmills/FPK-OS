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
import CourseHeader from '@/components/course/CourseHeader';

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

  const handleBackToCourses = () => navigate('/courses');
  const handleDashboard = () => navigate('/dashboard');

  const renderBlock = () => {
    if (!currentBlock) return null;

    switch (currentBlock.type) {
      case 'text':
        return (
          <div className="space-y-6">
            <Card className="w-full fpk-card border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
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
                            <div key={lineIndex} className="bg-primary/10 p-3 rounded-lg font-mono text-center border border-primary/20">
                              {line}
                            </div>
                          );
                        }
                        // Handle bullet points
                        if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                          return (
                            <li key={lineIndex} className="ml-4 text-foreground">
                              {line.replace(/^[•\-]\s*/, '')}
                            </li>
                          );
                        }
                        // Regular text
                        return line.trim() ? (
                          <p key={lineIndex} className="mb-2 last:mb-0 text-foreground">
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
              <Card className="overflow-hidden fpk-card border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-primary">Concept Visualization</CardTitle>
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
              <Card className="overflow-hidden fpk-card border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-primary">Balance Scale Model</CardTitle>
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
            <Card className="w-full fpk-card border-primary/30 shadow-lg">
              <CardHeader className="bg-primary/5 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Calculator className="w-5 h-5" />
                  {currentBlock.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {currentBlock.content.split('\n\n').map((section, index) => (
                    <div key={index} className="space-y-2">
                      {section.split('\n').map((line, lineIndex) => {
                        // Handle mathematical expressions
                        if (line.includes('=') && (line.includes('x') || line.includes('y'))) {
                          return (
                            <div key={lineIndex} className="bg-primary/10 p-4 rounded-lg border border-primary/20 font-mono text-center text-lg text-primary font-semibold">
                              {line}
                            </div>
                          );
                        }
                        // Handle step indicators
                        if (line.toLowerCase().includes('step')) {
                          return (
                            <h4 key={lineIndex} className="font-semibold text-primary mt-3 text-lg">
                              {line}
                            </h4>
                          );
                        }
                        return line.trim() ? (
                          <p key={lineIndex} className="text-foreground">
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
              <Card className="overflow-hidden fpk-card border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-primary">Step-by-Step Solution</CardTitle>
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
              <Card className="overflow-hidden fpk-card border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-primary">Balance Scale Model</CardTitle>
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
              <Card className="overflow-hidden fpk-card border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-primary">Number Line Solution</CardTitle>
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
            <Card className="w-full fpk-card border-accent/30 shadow-lg">
              <CardHeader className="bg-accent/5 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-accent">
                  <Calculator className="w-5 h-5" />
                  {currentBlock.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {currentBlock.content.split('\n').map((line, index) => {
                    if (line.trim()) {
                      return (
                        <div key={index} className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                          <p className="font-medium text-accent mb-2">{line}</p>
                          <Input 
                            type="text" 
                            placeholder="Your solution..." 
                            className="border-accent/20 focus:border-accent"
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
              <Card className="overflow-hidden fpk-card border-accent/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-accent">Algebraic Tiles</CardTitle>
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
              <Card className="overflow-hidden fpk-card border-accent/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-accent">Practice Examples</CardTitle>
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
              <Card className="overflow-hidden fpk-card border-accent/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-accent">Solution Methods</CardTitle>
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
            <Card className="w-full fpk-card border-primary/30 shadow-lg">
              <CardHeader className="bg-primary/5 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <CheckCircle className="w-5 h-5" />
                  {currentBlock.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {questions.map((question, index) => (
                  <div key={question.id} className="p-4 border border-primary/20 rounded-lg space-y-3 bg-primary/5">
                    <h4 className="font-medium text-primary">Question {index + 1}: {question.question}</h4>
                    
                    <Input
                      type="number"
                      value={quizAnswers[`${currentBlock.id}-${question.id}`] || ''}
                      onChange={(e) => setQuizAnswers({
                        ...quizAnswers,
                        [`${currentBlock.id}-${question.id}`]: parseFloat(e.target.value) || ''
                      })}
                      placeholder="Enter your answer"
                      disabled={isSubmitted}
                      className="border-primary/20 focus:border-primary"
                    />
                    
                    {isSubmitted && (
                      <div className={`p-3 rounded-lg ${
                        quizAnswers[`${currentBlock.id}-${question.id}`] == question.correctAnswer
                          ? 'bg-accent/10 text-accent border border-accent/20'
                          : 'bg-destructive/10 text-destructive border border-destructive/20'
                      }`}>
                        <p className="font-medium">
                          {quizAnswers[`${currentBlock.id}-${question.id}`] == question.correctAnswer
                            ? '✓ Correct!'
                            : `✗ Incorrect. The correct answer is ${question.correctAnswer}`
                          }
                        </p>
                        <p className="text-sm mt-1 opacity-80">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
                
                {!isSubmitted && (
                  <Button 
                    onClick={() => handleQuizSubmit(currentBlock.id)}
                    className="w-full fpk-gradient text-white hover:opacity-90"
                  >
                    Submit Quiz
                  </Button>
                )}
              </CardContent>
            </Card>
            
            {/* Quiz visual aids */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="overflow-hidden fpk-card border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-primary">Practice Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={practiceExamples}
                    alt="Quiz practice examples"
                    className="w-full h-48 object-cover rounded-lg"
                    loading="lazy"
                  />
                </CardContent>
              </Card>
              <Card className="overflow-hidden fpk-card border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-primary">Solution Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={stepByStepSolution}
                    alt="Solution strategies visualization"
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center fpk-gradient">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-white" />
          <p className="text-white">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center fpk-gradient">
        <div className="text-center space-y-4 fpk-card p-6 rounded-lg max-w-md">
          <p className="text-red-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="fpk-gradient text-white">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CourseHeader 
        onBackToCourses={handleBackToCourses}
        onDashboard={handleDashboard}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Course Progress Header */}
        <div className="fpk-card rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold fpk-text-gradient">{COURSE_DATA.title}</h1>
              <p className="text-muted-foreground mt-1">{COURSE_DATA.description}</p>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              {COURSE_DATA.difficulty}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {totalLessons} Lessons
            </span>
            <span className="flex items-center gap-1">
              <Calculator className="w-4 h-4" />
              {COURSE_DATA.estimatedTime}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Course Progress</span>
              <span className="text-primary font-semibold">
                {completedLessons.length}/{totalLessons} lessons completed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </div>

        {/* Current Lesson */}
        <div className="fpk-card rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">{currentLesson?.title}</h2>
              <p className="text-muted-foreground">Lesson {currentLessonIndex + 1} of {totalLessons}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrevious}
                disabled={!canGoPrevious}
                className="border-primary/20 hover:bg-primary/10"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm px-3 py-1 bg-primary/10 text-primary rounded font-medium">
                {currentBlockIndex + 1} / {currentLesson?.blocks.length || 0}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNext}
                disabled={!canGoNext}
                className="border-primary/20 hover:bg-primary/10"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Render current block */}
          <div className="mb-6">
            {renderBlock()}
          </div>

          {/* Navigation Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className="flex items-center gap-2 border-primary/20 hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {isLastBlock && !completedLessons.includes(currentLesson.id) && (
                <Button 
                  onClick={handleCompleteLesson}
                  className="fpk-gradient text-white hover:opacity-90"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Lesson
                </Button>
              )}
              
              <Button 
                onClick={handleNext}
                disabled={!canGoNext}
                className="flex items-center gap-2 fpk-gradient text-white hover:opacity-90"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveLinearEquationsCoursePage;