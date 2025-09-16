import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InteractiveCourseWrapper } from '@/components/course/InteractiveCourseWrapper';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Award, ChevronLeft, ChevronRight, X, Calculator, Target, TrendingUp } from 'lucide-react';
import CourseHeader from '@/components/course/CourseHeader';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import CourseOverviewTTS from '@/components/course/CourseOverviewTTS';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Import background image
import linearEquationsBg from '@/assets/linear-equations-background.jpg';

// Import lesson components
import { LinearEquationsIntroductionMicroLesson } from '@/components/micro-lessons/linear-equations/LinearEquationsIntroductionMicroLesson';
import { SOAPMethodMicroLesson } from '@/components/micro-lessons/linear-equations/SOAPMethodMicroLesson';
import { MultiStepEquationsMicroLesson } from '@/components/micro-lessons/linear-equations/MultiStepEquationsMicroLesson';
import { GraphingLinearEquationsMicroLesson } from '@/components/micro-lessons/linear-equations/GraphingLinearEquationsMicroLesson';
import { SpecialCasesMicroLesson } from '@/components/micro-lessons/linear-equations/SpecialCasesMicroLesson';
import { WordProblemsMicroLesson } from '@/components/micro-lessons/linear-equations/WordProblemsMicroLesson';
import { LinearEquationsMasteryMicroLesson } from '@/components/micro-lessons/linear-equations/LinearEquationsMasteryMicroLesson';

interface Lesson {
  id: number;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  unit: string;
  unitColor: string;
}

// Moved outside component to prevent recreation on every render
const lessons: Lesson[] = [
  { id: 1, title: "Introduction to Linear Equations", description: "Learn what linear equations are and understand the balance concept", component: LinearEquationsIntroductionMicroLesson, unit: "Unit 1: Foundations", unitColor: "bg-blue-100 text-blue-700" },
  { id: 2, title: "The SOAP Method", description: "Master the systematic approach to solving linear equations step-by-step", component: SOAPMethodMicroLesson, unit: "Unit 1: Foundations", unitColor: "bg-blue-100 text-blue-700" },
  { id: 3, title: "Multi-Step Equations", description: "Tackle complex equations with distribution and combining like terms", component: MultiStepEquationsMicroLesson, unit: "Unit 2: Advanced Solving", unitColor: "bg-purple-100 text-purple-700" },
  { id: 4, title: "Graphing Linear Equations", description: "Visualize equations on the coordinate plane and understand slopes", component: GraphingLinearEquationsMicroLesson, unit: "Unit 2: Advanced Solving", unitColor: "bg-purple-100 text-purple-700" },
  { id: 5, title: "Special Cases", description: "Identify equations with no solution or infinite solutions", component: SpecialCasesMicroLesson, unit: "Unit 3: Applications", unitColor: "bg-green-100 text-green-700" },
  { id: 6, title: "Word Problems", description: "Apply linear equation skills to solve real-world problems", component: WordProblemsMicroLesson, unit: "Unit 3: Applications", unitColor: "bg-green-100 text-green-700" },
  { id: 7, title: "Linear Equations Mastery", description: "Complete challenging problems and celebrate your mathematical journey", component: LinearEquationsMasteryMicroLesson, unit: "Unit 3: Applications", unitColor: "bg-green-100 text-green-700" }
];

const InteractiveLinearEquationsCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [currentLesson, setCurrentLesson] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [accordionOpen, setAccordionOpen] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (lessonId) {
      const lesson = parseInt(lessonId);
      if (lesson >= 1 && lesson <= lessons.length) {
        setCurrentLesson(lesson);
      }
    } else {
      // Reset to course overview when no lesson ID is present
      setCurrentLesson(null);
    }
  }, [lessonId]);

  const handleLessonComplete = (lessonId: number) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons(prev => [...prev, lessonId]);
    }
  };

  // Memoize navigation handlers to prevent unnecessary re-renders
  const handleNextLesson = useCallback(() => {
    if (currentLesson !== null && currentLesson < lessons.length) {
      const nextLesson = currentLesson + 1;
      setCurrentLesson(nextLesson);
      navigate(`/courses/interactive-linear-equations/${nextLesson}`);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigate]);

  const handlePrevLesson = useCallback(() => {
    if (currentLesson !== null && currentLesson > 1) {
      const prevLesson = currentLesson - 1;
      setCurrentLesson(prevLesson);
      navigate(`/courses/interactive-linear-equations/${prevLesson}`);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigate]);

  const handleLessonSelect = useCallback((lessonId: number) => {
    setCurrentLesson(lessonId);
    navigate(`/courses/interactive-linear-equations/${lessonId}`);
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const handleBackToCourses = useCallback(() => {
    navigate('/dashboard/learner/courses');
  }, [navigate]);

  const handleDashboard = useCallback(() => {
    navigate('/dashboard/learner');
  }, [navigate]);

  const handleBackToCourseOverview = useCallback(() => {
    navigate('/courses/interactive-linear-equations');
  }, [navigate]);

  // Memoize expensive calculations
  const isLessonAccessible = useCallback((lessonId: number) => {
    return lessonId === 1 || completedLessons.includes(lessonId - 1);
  }, [completedLessons]);

  const progress = useMemo(() => (completedLessons.length / lessons.length) * 100, [completedLessons.length]);

  // Course overview (lesson selection)
  if (currentLesson === null) {
    return (
      <VoiceSettingsProvider>
        <InteractiveCourseWrapper
          courseId="interactive-linear-equations"
          courseTitle="Interactive Linear Equations"
          currentLesson={currentLesson}
          totalLessons={lessons.length}
        >
          <div className="min-h-screen bg-gradient-to-br from-background to-muted/20" style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${linearEquationsBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}>
            <CourseHeader 
              onDashboard={handleDashboard} 
              onBackToCourses={handleBackToCourses}
              courseTitle="Interactive Linear Equations"
            />
          
            <div className="container mx-auto px-4 py-8 space-y-8">
              {/* Course Title and Description */}
              <div className="text-center space-y-4">
                <div className="flex justify-center items-center gap-3 mb-4">
                  <Calculator className="w-12 h-12 text-blue-400" />
                  <h1 className="text-4xl font-bold text-white drop-shadow-lg">Interactive Linear Equations</h1>
                  <Target className="w-12 h-12 text-purple-400" />
                </div>
                <p className="text-xl text-white max-w-3xl mx-auto font-medium">
                  Master the fundamentals of linear equations through interactive lessons and step-by-step problem solving. Build a strong algebraic foundation for advanced mathematics.
                </p>
                
                {/* Course badges */}
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge variant="secondary" className="text-sm px-3 py-1 bg-white/90 text-gray-800 border-white/20">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {lessons.length} Lessons
                  </Badge>
                  <Badge variant="secondary" className="text-sm px-3 py-1 bg-white/90 text-gray-800 border-white/20">
                    <Clock className="w-4 h-4 mr-2" />
                    ~5 Hours
                  </Badge>
                  <Badge variant="secondary" className="text-sm px-3 py-1 bg-white/90 text-gray-800 border-white/20">
                    <Calculator className="w-4 h-4 mr-2" />
                    Algebra Foundation
                  </Badge>
                </div>

                <div className="max-w-md mx-auto">
                  <Progress value={progress} className="h-2 mb-2" />
                  <p className="text-xs text-white mt-1 text-center font-medium">
                    {completedLessons.length} of {lessons.length} lessons completed
                  </p>
                </div>
              </div>

              {/* Voice Controls */}
              <div className="mb-8">
                <CourseOverviewTTS 
                  courseTitle="Interactive Linear Equations"
                  courseDescription="Master the fundamentals of linear equations through interactive lessons and step-by-step problem solving. Build a strong algebraic foundation for advanced mathematics."
                  lessons={lessons}
                />
              </div>

              {/* Enhanced Course Information */}
              <div className="max-w-4xl mx-auto">
                <Accordion 
                  type="single" 
                  collapsible 
                  className="w-full space-y-4"
                  value={accordionOpen}
                  onValueChange={setAccordionOpen}
                >
                  <AccordionItem value="course-info">
                    <AccordionTrigger className="flex items-center justify-center text-center text-xl font-semibold bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-4 py-3 rounded-lg text-blue-900 dark:text-blue-100">
                      Course Overview & Learning Objectives
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-gray max-w-none text-sm relative">
                      <div className="space-y-6 pr-12">
                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-white">Why Linear Equations Matter</h3>
                          <p className="text-white leading-relaxed">
                            Linear equations are the foundation of algebra and essential for success in higher mathematics, science, engineering, and many real-world applications. This course provides you with the tools and confidence to solve linear equations systematically and understand their graphical representations.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-white">What You'll Learn</h3>
                          <ul className="space-y-2 text-white">
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Linear Equation Fundamentals:</strong> Understanding what linear equations are and the balance concept</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>SOAP Solving Method:</strong> A systematic approach to solve any linear equation step-by-step</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Multi-Step Equations:</strong> Working with distribution, combining like terms, and complex problems</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Graphing Skills:</strong> Visualizing linear equations on coordinate planes and understanding slopes</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Special Cases:</strong> Identifying equations with no solution or infinitely many solutions</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Word Problems:</strong> Applying linear equation skills to solve real-world problems</span>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-white">Interactive Learning Features</h3>
                          <p className="text-white mb-3">Throughout this course, you'll experience:</p>
                          <ul className="space-y-1 text-white">
                            <li className="flex gap-3"><span className="font-medium text-foreground">•</span> Step-by-step interactive problem solving</li>
                            <li className="flex gap-3"><span className="font-medium text-foreground">•</span> Visual representations and graphing tools</li>
                            <li className="flex gap-3"><span className="font-medium text-foreground">•</span> Practice problems with immediate feedback</li>
                            <li className="flex gap-3"><span className="font-medium text-foreground">•</span> Real-world applications and word problems</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Lessons Grid */}
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-8 text-center">Course Lessons</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lessons.map((lesson) => {
                    const isAccessible = isLessonAccessible(lesson.id);
                    const isCompleted = completedLessons.includes(lesson.id);
                    
                    return (
                      <Card 
                        key={lesson.id}
                        className={`relative transition-all duration-200 cursor-pointer hover:shadow-lg bg-card/65 backdrop-blur-sm border-border ${
                          !isAccessible ? 'opacity-50' : ''
                        } ${isCompleted ? 'border-primary/50' : 'border-border'}`}
                        onClick={() => isAccessible && handleLessonSelect(lesson.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className={lesson.unitColor}>
                              {lesson.unit}
                            </Badge>
                            {isCompleted && <Award className="w-5 h-5 text-primary" />}
                          </div>
                          <CardTitle className="text-lg">{lesson.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-sm mb-4">{lesson.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Lesson {lesson.id}</span>
                            {!isAccessible && (
                              <span className="text-xs text-muted-foreground">Complete previous lesson</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </InteractiveCourseWrapper>
      </VoiceSettingsProvider>
    );
  }

  // Individual lesson view
  const currentLessonData = lessons.find(l => l.id === currentLesson);
  
  if (!currentLessonData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Lesson Not Found</h2>
            <p className="text-white mb-4 font-medium">
              The requested lesson could not be found.
            </p>
            <Button onClick={() => navigate('/courses/interactive-linear-equations')}>
              Back to Course Overview
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasNext = currentLesson < lessons.length;
  const hasPrev = currentLesson > 1;

  const LessonComponent = currentLessonData.component;

  return (
    <VoiceSettingsProvider>
      <InteractiveCourseWrapper 
        courseId="interactive-linear-equations"
        courseTitle="Interactive Linear Equations"
        currentLesson={currentLesson}
        totalLessons={lessons.length}
      >
        <div className="min-h-screen bg-background" style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${linearEquationsBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}>
          <CourseHeader 
            onDashboard={handleDashboard}
            onBackToCourses={handleBackToCourseOverview}
            courseTitle="Interactive Linear Equations"
          />

          <div className="container mx-auto px-4 py-6">
            <InteractiveLessonWrapper
              courseId="interactive-linear-equations"
              lessonId={currentLesson}
              lessonTitle={currentLessonData.title}
              totalLessons={lessons.length}
            >
              <LessonComponent
                onComplete={() => handleLessonComplete(currentLesson)}
                onNext={hasNext ? handleNextLesson : undefined}
                hasNext={hasNext}
              />
            </InteractiveLessonWrapper>
          </div>
        </div>
      </InteractiveCourseWrapper>
    </VoiceSettingsProvider>
  );
};

export default InteractiveLinearEquationsCoursePage;