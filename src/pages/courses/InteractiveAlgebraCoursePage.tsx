import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InteractiveCourseWrapper } from '@/components/course/InteractiveCourseWrapper';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Award, ChevronLeft, ChevronRight, X, Calculator, Target, Brain } from 'lucide-react';
import CourseHeader from '@/components/course/CourseHeader';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import CourseOverviewTTS from '@/components/course/CourseOverviewTTS';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Import background image
import algebraBg from '@/assets/linear-equations-background.jpg';

// Import micro-lesson components
import { AlgebraIntroductionMicroLesson } from '@/components/micro-lessons/algebra/AlgebraIntroductionMicroLesson';
import { AlgebraVariablesMicroLesson } from '@/components/micro-lessons/algebra/AlgebraVariablesMicroLesson';
import { AlgebraSimpleEquationsMicroLesson } from '@/components/micro-lessons/algebra/AlgebraSimpleEquationsMicroLesson';
import { AlgebraLinearGraphingMicroLesson } from '@/components/micro-lessons/algebra/AlgebraLinearGraphingMicroLesson';
import { AlgebraSystemsEquationsMicroLesson } from '@/components/micro-lessons/algebra/AlgebraSystemsEquationsMicroLesson';
import { AlgebraQuadraticsMicroLesson } from '@/components/micro-lessons/algebra/AlgebraQuadraticsMicroLesson';
import { AlgebraApplicationsMicroLesson } from '@/components/micro-lessons/algebra/AlgebraApplicationsMicroLesson';

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
  { id: 1, title: "Introduction to Algebra", description: "Learn fundamental algebra concepts, variables, constants, and order of operations", component: AlgebraIntroductionMicroLesson, unit: "Unit 1: Foundations", unitColor: "bg-green-100 text-green-700" },
  { id: 2, title: "Working with Variables", description: "Master like terms, distributive property, and simplifying expressions", component: AlgebraVariablesMicroLesson, unit: "Unit 1: Foundations", unitColor: "bg-green-100 text-green-700" },
  { id: 3, title: "Solving Simple Equations", description: "Learn to solve linear equations using balance method and inverse operations", component: AlgebraSimpleEquationsMicroLesson, unit: "Unit 2: Equations", unitColor: "bg-blue-100 text-blue-700" },
  { id: 4, title: "Linear Equations and Graphing", description: "Understand coordinate planes, graphing lines, slope, and y-intercept", component: AlgebraLinearGraphingMicroLesson, unit: "Unit 2: Equations", unitColor: "bg-blue-100 text-blue-700" },
  { id: 5, title: "Systems of Equations", description: "Solve systems using substitution and elimination methods", component: AlgebraSystemsEquationsMicroLesson, unit: "Unit 3: Advanced", unitColor: "bg-purple-100 text-purple-700" },
  { id: 6, title: "Quadratic Equations", description: "Learn to solve quadratics by factoring and using the quadratic formula", component: AlgebraQuadraticsMicroLesson, unit: "Unit 3: Advanced", unitColor: "bg-purple-100 text-purple-700" },
  { id: 7, title: "Advanced Applications", description: "Apply algebra to real-world problems in science, business, and technology", component: AlgebraApplicationsMicroLesson, unit: "Unit 3: Advanced", unitColor: "bg-purple-100 text-purple-700" }
];

const InteractiveAlgebraCoursePage: React.FC = () => {
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
      setCurrentLesson(null);
    }
  }, [lessonId]);

  const handleLessonComplete = (lessonId: number) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons(prev => [...prev, lessonId]);
    }
  };

  const handleNextLesson = useCallback(() => {
    if (currentLesson !== null && currentLesson < lessons.length) {
      const nextLesson = currentLesson + 1;
      setCurrentLesson(nextLesson);
      navigate(`/courses/interactive-algebra/${nextLesson}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigate]);

  const handleLessonSelect = useCallback((lessonId: number) => {
    setCurrentLesson(lessonId);
    navigate(`/courses/interactive-algebra/${lessonId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const handleBackToCourses = useCallback(() => {
    console.log('📍 Navigating back to courses');
    navigate('/dashboard/learner/courses');
  }, [navigate]);

  const handleDashboard = useCallback(() => {
    navigate('/dashboard/learner');
  }, [navigate]);

  const isLessonAccessible = useCallback((lessonId: number) => {
    return lessonId === 1 || completedLessons.includes(lessonId - 1);
  }, [completedLessons]);

  const progress = useMemo(() => (completedLessons.length / lessons.length) * 100, [completedLessons.length]);

  // Course overview (lesson selection)
  if (currentLesson === null) {
    return (
      <VoiceSettingsProvider>
        <InteractiveCourseWrapper
          courseId="interactive-algebra"
          courseTitle="Interactive Algebra"
          currentLesson={currentLesson}
          totalLessons={lessons.length}
        >
          <div className="min-h-screen bg-gradient-to-br from-background to-muted/20" style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${algebraBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}>
            <CourseHeader 
              onDashboard={handleDashboard} 
              onBackToCourses={handleBackToCourses}
              courseTitle="Interactive Algebra"
            />
          
            <div className="container mx-auto px-4 py-8 space-y-8">
              {/* Course Title and Description */}
              <div className="text-center space-y-4">
                <div className="flex justify-center items-center gap-3 mb-4">
                  <Calculator className="w-12 h-12 text-blue-400" />
                  <h1 className="text-4xl font-bold text-white drop-shadow-lg">Interactive Algebra</h1>
                  <Brain className="w-12 h-12 text-blue-400" />
                </div>
                <p className="text-xl text-white max-w-3xl mx-auto font-medium">
                  Master algebra fundamentals through interactive lessons and step-by-step problem solving. Learn to work with variables, solve equations, and apply algebra to real-world situations.
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
                    <Target className="w-4 h-4 mr-2" />
                    Problem Solving
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
                  courseTitle="Interactive Algebra"
                  courseDescription="Master algebra fundamentals through interactive lessons and step-by-step problem solving. Learn to work with variables, solve equations, and apply algebra to real-world situations."
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
                      Course Overview &amp; Learning Objectives
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-gray max-w-none text-sm relative">
                      <div className="space-y-6 pr-12">
                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-white">Why Learn Algebra?</h3>
                          <p className="text-white leading-relaxed">
                            Algebra is the foundation of higher mathematics and critical thinking. It teaches you to recognize patterns, solve problems systematically, and model real-world situations mathematically. These skills are essential for STEM careers, logical reasoning, and everyday problem-solving.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-white">What You'll Master</h3>
                          <ul className="space-y-2 text-white">
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Algebraic Foundations:</strong> Variables, constants, expressions, and the language of algebra</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Equation Solving:</strong> Linear and quadratic equations using multiple methods</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Graphing Skills:</strong> Coordinate planes, linear relationships, and parabolas</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Systems:</strong> Solving multiple equations simultaneously</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Real-World Applications:</strong> Using algebra in science, business, and technology</span>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-white">Interactive Learning Experience</h3>
                          <p className="text-white mb-3">This course uses a micro-lesson approach with:</p>
                          <ul className="space-y-1 text-white">
                            <li className="flex gap-3"><span className="font-medium text-foreground">•</span> Step-by-step explanations with visual examples</li>
                            <li className="flex gap-3"><span className="font-medium text-foreground">•</span> Interactive practice problems with immediate feedback</li>
                            <li className="flex gap-3"><span className="font-medium text-foreground">•</span> Real-world applications and problem-solving strategies</li>
                            <li className="flex gap-3"><span className="font-medium text-foreground">•</span> Progressive difficulty that builds confidence</li>
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
            <Button onClick={() => navigate('/courses/interactive-algebra')}>
              Back to Course Overview
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasNext = currentLesson < lessons.length;
  const LessonComponent = currentLessonData.component;

  return (
    <VoiceSettingsProvider>
      <InteractiveCourseWrapper 
        courseId="interactive-algebra"
        courseTitle="Interactive Algebra"
        currentLesson={currentLesson}
        totalLessons={lessons.length}
      >
        <div className="min-h-screen bg-background" style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${algebraBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}>
          <CourseHeader 
            onDashboard={handleDashboard} 
            onBackToCourses={handleBackToCourses}
            title={`Lesson ${currentLessonData.id}: ${currentLessonData.title}`}
          />

          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <Button 
                variant="outline" 
                onClick={() => navigate('/courses/interactive-algebra')}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Course
              </Button>
              
              <div className="text-center">
                <Badge className={currentLessonData.unitColor}>
                  {currentLessonData.unit}
                </Badge>
                <h1 className="text-2xl font-bold text-white mt-2">
                  {currentLessonData.title}
                </h1>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-white">
                  {currentLesson} of {lessons.length}
                </span>
                <Progress value={(currentLesson / lessons.length) * 100} className="w-20 h-2" />
              </div>
            </div>

            <InteractiveLessonWrapper
              courseId="interactive-algebra"
              lessonId={currentLesson}
              lessonTitle={currentLessonData.title}
              onComplete={() => handleLessonComplete(currentLessonData.id)}
              onNext={handleNextLesson}
              hasNext={hasNext}
            >
              <LessonComponent 
                onComplete={() => handleLessonComplete(currentLessonData.id)}
                onNext={handleNextLesson}
                hasNext={hasNext}
              />
            </InteractiveLessonWrapper>
          </div>
        </div>
      </InteractiveCourseWrapper>
    </VoiceSettingsProvider>
  );
};

export default InteractiveAlgebraCoursePage;