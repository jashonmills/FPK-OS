import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InteractiveCourseWrapper } from '@/components/course/InteractiveCourseWrapper';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Award, ChevronLeft, ChevronRight, X, DollarSign, TrendingUp, PiggyBank } from 'lucide-react';
import CourseHeader from '@/components/course/CourseHeader';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import CourseOverviewTTS from '@/components/course/CourseOverviewTTS';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Import lesson components
import { FinancialFoundationsMicroLesson } from '@/components/micro-lessons/money-management/FinancialFoundationsMicroLesson';
import { BankingAccountsMicroLesson } from '@/components/micro-lessons/money-management/BankingAccountsMicroLesson';
import { BudgetingMasteryMicroLesson } from '@/components/micro-lessons/money-management/BudgetingMasteryMicroLesson';
import { SavingStrategiesMicroLesson } from '@/components/micro-lessons/money-management/SavingStrategiesMicroLesson';
import { InvestingBasicsMicroLesson } from '@/components/micro-lessons/money-management/InvestingBasicsMicroLesson';
import { CreditDebtPlanningMicroLesson } from '@/components/micro-lessons/money-management/CreditDebtPlanningMicroLesson';

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
  { id: 1, title: "Financial Foundations", description: "Learn basic financial concepts, money values, and needs vs wants", component: FinancialFoundationsMicroLesson, unit: "Unit 1: Basics", unitColor: "bg-green-100 text-green-700" },
  { id: 2, title: "Banking and Accounts", description: "Understand banking basics, account types, and safety practices", component: BankingAccountsMicroLesson, unit: "Unit 1: Basics", unitColor: "bg-green-100 text-green-700" },
  { id: 3, title: "Budgeting Mastery", description: "Create budgets, track expenses, and manage income effectively", component: BudgetingMasteryMicroLesson, unit: "Unit 2: Planning", unitColor: "bg-blue-100 text-blue-700" },
  { id: 4, title: "Smart Saving Strategies", description: "Explore savings accounts, compound interest, and goal setting", component: SavingStrategiesMicroLesson, unit: "Unit 2: Planning", unitColor: "bg-blue-100 text-blue-700" },
  { id: 5, title: "Introduction to Investing", description: "Learn basic investment concepts and long-term wealth building", component: InvestingBasicsMicroLesson, unit: "Unit 3: Growth", unitColor: "bg-purple-100 text-purple-700" },
  { id: 6, title: "Credit, Debt, and Future Planning", description: "Understand credit scores, responsible borrowing, and financial goals", component: CreditDebtPlanningMicroLesson, unit: "Unit 3: Growth", unitColor: "bg-purple-100 text-purple-700" }
];

const MoneyManagementCoursePage: React.FC = () => {
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
      navigate(`/courses/money-management-teens/${nextLesson}`);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigate]);

  const handlePrevLesson = useCallback(() => {
    if (currentLesson !== null && currentLesson > 1) {
      const prevLesson = currentLesson - 1;
      setCurrentLesson(prevLesson);
      navigate(`/courses/money-management-teens/${prevLesson}`);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigate]);

  const handleLessonSelect = useCallback((lessonId: number) => {
    setCurrentLesson(lessonId);
    navigate(`/courses/money-management-teens/${lessonId}`);
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const handleBackToCourses = useCallback(() => {
    navigate('/dashboard/learner/courses');
  }, [navigate]);

  const handleDashboard = useCallback(() => {
    navigate('/dashboard/learner');
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
          courseId="money-management-teens"
          courseTitle="Money Management for Teens"
          currentLesson={currentLesson}
          totalLessons={lessons.length}
        >
          <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-700">
            <CourseHeader 
              onDashboard={handleDashboard} 
              onBackToCourses={handleBackToCourses}
              courseTitle="Money Management for Teens"
            />
          
            <div className="container mx-auto px-4 py-8 space-y-8">
              {/* Course Title and Description */}
              <div className="text-center space-y-4">
                <div className="flex justify-center items-center gap-3 mb-4">
                  <DollarSign className="w-12 h-12 text-green-400" />
                  <h1 className="text-4xl font-bold text-white drop-shadow-lg">Money Management for Teens</h1>
                  <TrendingUp className="w-12 h-12 text-green-400" />
                </div>
                <p className="text-xl text-white max-w-3xl mx-auto font-medium">
                  Build essential financial literacy skills for life success. Learn budgeting, saving, banking, and smart money decisions to secure your financial future.
                </p>
                
                {/* Course badges */}
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge variant="secondary" className="text-sm px-3 py-1 bg-white/90 text-gray-800 border-white/20">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {lessons.length} Lessons
                  </Badge>
                  <Badge variant="secondary" className="text-sm px-3 py-1 bg-white/90 text-gray-800 border-white/20">
                    <Clock className="w-4 h-4 mr-2" />
                    ~4 Hours
                  </Badge>
                  <Badge variant="secondary" className="text-sm px-3 py-1 bg-white/90 text-gray-800 border-white/20">
                    <PiggyBank className="w-4 h-4 mr-2" />
                    Financial Literacy
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
                  courseTitle="Money Management for Teens"
                  courseDescription="Build essential financial literacy skills for life success. Learn budgeting, saving, banking, and smart money decisions to secure your financial future."
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
                    <AccordionTrigger className="flex items-center justify-center text-center text-xl font-semibold bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-900/40 px-4 py-3 rounded-lg text-green-900 dark:text-green-100">
                      Course Overview & Learning Objectives
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-gray max-w-none text-sm relative">
                      <div className="space-y-6 pr-12">
                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-white">Why Financial Literacy Matters for Teens</h3>
                          <p className="text-white leading-relaxed">
                            Financial literacy is one of the most important life skills you can develop as a teenager. This course provides practical, real-world knowledge that will help you make smart money decisions throughout your life, from managing your first job's paycheck to planning for major purchases and your financial future.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-white">What You'll Learn</h3>
                          <ul className="space-y-2 text-white">
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Financial Foundations:</strong> Understanding money, making smart spending decisions, and distinguishing between needs and wants</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Banking Essentials:</strong> How to open and manage bank accounts, use ATMs safely, and understand banking fees</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Budgeting Skills:</strong> Creating and maintaining a budget, tracking expenses, and using budgeting tools and apps</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Saving Strategies:</strong> Understanding compound interest, setting financial goals, and building emergency funds</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Investment Basics:</strong> Introduction to investing concepts, risk vs. return, and long-term wealth building</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Credit and Debt:</strong> Understanding credit scores, responsible borrowing, and avoiding debt traps</span>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-white">Real-World Applications</h3>
                          <p className="text-white mb-3">Throughout this course, you'll work with:</p>
                          <ul className="space-y-1 text-white">
                            <li className="flex gap-3"><span className="font-medium text-foreground">•</span> Interactive budget calculators and planning tools</li>
                            <li className="flex gap-3"><span className="font-medium text-foreground">•</span> Real-world scenarios and case studies</li>
                            <li className="flex gap-3"><span className="font-medium text-foreground">•</span> Practical exercises using actual financial products and services</li>
                            <li className="flex gap-3"><span className="font-medium text-foreground">•</span> Goal-setting frameworks for short and long-term financial objectives</li>
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
  const lesson = lessons.find(l => l.id === currentLesson);
  
  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Lesson not found</h2>
          <Button onClick={() => setCurrentLesson(null)}>Back to Course Overview</Button>
        </div>
      </div>
    );
  }

  const LessonComponent = lesson.component;

  return (
    <VoiceSettingsProvider>
      <InteractiveLessonWrapper
        courseId="money-management-teens"
        lessonId={currentLesson}
        lessonTitle={lesson.title}
        onComplete={() => handleLessonComplete(currentLesson)}
        onNext={currentLesson < lessons.length ? handleNextLesson : undefined}
        hasNext={currentLesson < lessons.length}
        totalLessons={lessons.length}
      >
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-700">
          {/* Header with navigation */}
          <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentLesson(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Exit Lesson
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Lesson {currentLesson} of {lessons.length}
                  </div>
                </div>

                <h1 className="text-lg font-semibold text-center flex-1 mx-4">
                  {lesson.title}
                </h1>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevLesson}
                    disabled={currentLesson === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextLesson}
                    disabled={currentLesson === lessons.length}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="container mx-auto px-4 py-8">
            <LessonComponent
              onComplete={() => handleLessonComplete(currentLesson)}
              onNext={currentLesson < lessons.length ? handleNextLesson : undefined}
              hasNext={currentLesson < lessons.length}
            />
          </div>
        </div>
      </InteractiveLessonWrapper>
    </VoiceSettingsProvider>
  );
};

export default MoneyManagementCoursePage;