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

// Import background image
import moneyManagementBg from '@/assets/money-management-background.jpg';

// Import lesson components
import { FinancialFoundationsMicroLesson } from '@/components/micro-lessons/money-management/FinancialFoundationsMicroLesson';
import { BankingAccountsMicroLesson } from '@/components/micro-lessons/money-management/BankingAccountsMicroLesson';
import { BudgetingMasteryMicroLesson } from '@/components/micro-lessons/money-management/BudgetingMasteryMicroLesson';
import { SavingStrategiesMicroLesson } from '@/components/micro-lessons/money-management/SavingStrategiesMicroLesson';
import { InvestingBasicsMicroLesson } from '@/components/micro-lessons/money-management/InvestingBasicsMicroLesson';
import { CreditDebtPlanningMicroLesson } from '@/components/micro-lessons/money-management/CreditDebtPlanningMicroLesson';
import { MoneyManagementGameMicroLesson } from '@/components/micro-lessons/money-management/MoneyManagementGameMicroLesson';

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
  { id: 6, title: "Credit, Debt, and Future Planning", description: "Understand credit scores, responsible borrowing, and financial goals", component: CreditDebtPlanningMicroLesson, unit: "Unit 3: Growth", unitColor: "bg-purple-100 text-purple-700" },
  { id: 7, title: "Financial Decision-Making Game", description: "Apply your knowledge in an interactive money management simulation", component: MoneyManagementGameMicroLesson, unit: "Unit 3: Growth", unitColor: "bg-purple-100 text-purple-700" }
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
    console.log('📍 Navigating back to courses');
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
          <div className="min-h-screen bg-gradient-to-br from-background to-muted/20" style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${moneyManagementBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}>
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
                    ~5 Hours
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
            <Button onClick={() => setCurrentLesson(null)}>
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
        courseId="money-management-teens"
        courseTitle="Money Management for Teens"
        currentLesson={currentLesson}
        totalLessons={lessons.length}
      >
        <div className="min-h-screen bg-background" style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${moneyManagementBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}>
          <CourseHeader 
            onBackToCourses={() => navigate('/dashboard/learner/courses')}
            onDashboard={handleDashboard}
            courseTitle="Money Management for Teens"
          />
          
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentLesson(null)}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Overview
              </Button>
              <Badge className={currentLessonData.unitColor}>
                {currentLessonData.unit}
              </Badge>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mb-6">
              <Button
                variant="outline"
                onClick={handlePrevLesson}
                disabled={!hasPrev}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Lesson
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-white font-medium">
                  Lesson {currentLesson} of {lessons.length}
                </span>
              </div>

              <Button
                variant="outline"
                onClick={handleNextLesson}
                disabled={!hasNext}
                className="flex items-center gap-2"
              >
                Next Lesson
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Lesson Progress Card */}
            <Card className="mb-6 bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      Lesson {currentLesson}: {currentLessonData.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-white/80 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        0:06
                      </span>
                      <span className="flex items-center gap-1">
                        📈 Engagement: 0%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Listen to Lesson */}
            <Card className="mb-6 bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <span className="text-white font-medium">Listen to Lesson</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="text-white">
                      ⚙️
                    </Button>
                    <Button className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white">
                      ▶️ Read Lesson
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lesson Content */}
            <InteractiveLessonWrapper
              courseId="money-management-teens"
              lessonId={currentLesson}
              lessonTitle={currentLessonData.title}
              onComplete={() => handleLessonComplete(currentLesson)}
              onNext={hasNext ? handleNextLesson : undefined}
              hasNext={hasNext}
              totalLessons={lessons.length}
              suppressWrapperCompletion={currentLesson === 7} // Suppress for game lesson
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

export default MoneyManagementCoursePage;