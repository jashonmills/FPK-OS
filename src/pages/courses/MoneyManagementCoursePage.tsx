import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useContextAwareNavigation } from '@/hooks/useContextAwareNavigation';
import { useCourseNavigation } from '@/hooks/useCourseNavigation';
import { InteractiveCourseWrapper } from '@/components/course/InteractiveCourseWrapper';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { useInteractiveCourseProgress } from '@/hooks/useInteractiveCourseProgress';
import { useCourseEnrollment } from '@/hooks/useCourseEnrollment';
import { useInteractiveCourseEnrollmentBridge } from '@/hooks/useInteractiveCourseEnrollmentBridge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Award, ChevronLeft, ChevronRight, X } from 'lucide-react';
import CourseHeader from '@/components/course/CourseHeader';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import CourseOverviewTTS from '@/components/course/CourseOverviewTTS';
import { AdditionalResourcesSection } from '@/components/course/resources/AdditionalResourcesSection';
import { StudentGuidesAccordion } from '@/components/course/resources/StudentGuidesAccordion';
import { EnhancedCourseInfoAccordion } from '@/components/course/resources/EnhancedCourseInfoAccordion';
import moneyManagementBg from '@/assets/money-management-teens-bg.jpg';

// Import micro-lesson components
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

// Course lessons array
const lessons: Lesson[] = [
  { 
    id: 1, 
    title: "Financial Foundations", 
    description: "Learn basic financial concepts, money values, and needs vs wants", 
    component: FinancialFoundationsMicroLesson, 
    unit: "Unit 1: Basics", 
    unitColor: "bg-green-100 text-green-700" 
  },
  { 
    id: 2, 
    title: "Banking and Accounts", 
    description: "Understand banking basics, account types, and safety practices", 
    component: BankingAccountsMicroLesson, 
    unit: "Unit 1: Basics", 
    unitColor: "bg-green-100 text-green-700" 
  },
  { 
    id: 3, 
    title: "Budgeting Mastery", 
    description: "Create budgets, track expenses, and manage income effectively", 
    component: BudgetingMasteryMicroLesson, 
    unit: "Unit 2: Planning", 
    unitColor: "bg-blue-100 text-blue-700" 
  },
  { 
    id: 4, 
    title: "Smart Saving Strategies", 
    description: "Explore savings accounts, compound interest, and goal setting", 
    component: SavingStrategiesMicroLesson, 
    unit: "Unit 2: Planning", 
    unitColor: "bg-blue-100 text-blue-700" 
  },
  { 
    id: 5, 
    title: "Introduction to Investing", 
    description: "Learn basic investment concepts and long-term wealth building", 
    component: InvestingBasicsMicroLesson, 
    unit: "Unit 3: Growth", 
    unitColor: "bg-purple-100 text-purple-700" 
  },
  { 
    id: 6, 
    title: "Credit, Debt, and Future Planning", 
    description: "Understand credit scores, responsible borrowing, and financial goals", 
    component: CreditDebtPlanningMicroLesson, 
    unit: "Unit 3: Growth", 
    unitColor: "bg-purple-100 text-purple-700" 
  },
  { 
    id: 7, 
    title: "Financial Decision-Making Game", 
    description: "Apply your knowledge in an interactive money management simulation", 
    component: MoneyManagementGameMicroLesson, 
    unit: "Unit 3: Growth", 
    unitColor: "bg-purple-100 text-purple-700" 
  }
];

export const MoneyManagementCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const { goToCourses, goToDashboard } = useContextAwareNavigation();
  const { navigateToLesson, navigateToOverview } = useCourseNavigation('money-management-teens');
  const { lessonId } = useParams();
  const [currentLesson, setCurrentLesson] = useState<number | null>(null);
  const [accordionOpen, setAccordionOpen] = useState<string | undefined>(undefined);

  // Use analytics and progress hooks
  const courseId = 'money-management-teens';
  const courseTitle = 'Money Management for Teens';
  const {
    completedLessons,
    isLessonCompleted,
    calculateProgress,
    saveLessonCompletion,
    progressData
  } = useInteractiveCourseProgress(courseId);
  
  const { enrollInCourse, isEnrolling } = useCourseEnrollment();
  const isEnrolled = progressData?.enrollment !== null;
  
  useInteractiveCourseEnrollmentBridge();

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

  const handleLessonComplete = async (lessonId: number) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      await saveLessonCompletion(lessonId, lesson.title);
    }
  };

  const handleNextLesson = useCallback(() => {
    if (currentLesson !== null && currentLesson < lessons.length) {
      const nextLesson = currentLesson + 1;
      setCurrentLesson(nextLesson);
      navigateToLesson(nextLesson);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigateToLesson]);

  const handlePrevLesson = useCallback(() => {
    if (currentLesson !== null && currentLesson > 1) {
      const prevLesson = currentLesson - 1;
      setCurrentLesson(prevLesson);
      navigateToLesson(prevLesson);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigateToLesson]);

  const handleLessonSelect = useCallback((lessonId: number) => {
    setCurrentLesson(lessonId);
    navigateToLesson(lessonId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigateToLesson]);

  const handleBackToCourses = useCallback(() => {
    console.log('📍 Navigating back to courses');
    goToCourses();
  }, [goToCourses]);

  const handleDashboard = useCallback(() => {
    goToDashboard();
  }, [goToDashboard]);

  const isLessonAccessible = useCallback((lessonId: number) => {
    return lessonId === 1 || isLessonCompleted(lessonId - 1);
  }, [isLessonCompleted]);

  const progress = useMemo(() => calculateProgress(lessons.length), [calculateProgress]);

  // Course overview (lesson selection)
  if (currentLesson === null) {
    return (
      <VoiceSettingsProvider>
        <InteractiveCourseWrapper
          courseId={courseId}
          courseTitle={courseTitle}
          currentLesson={currentLesson}
          totalLessons={lessons.length}
        >
          <div className="min-h-screen bg-gradient-to-br from-background to-muted/20" style={{
            backgroundImage: `radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%), linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${moneyManagementBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}>
            <CourseHeader 
              courseTitle={courseTitle}
            />
          
            <div className="container mx-auto px-4 py-8 space-y-8">
              {/* Course Title and Description */}
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-white drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>Money Management for Teens</h1>
                <p className="text-xl text-white max-w-3xl mx-auto font-medium" style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)' }}>
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
                    <Users className="w-4 h-4 mr-2" />
                    Beginner Friendly
                  </Badge>
                </div>

                <div className="max-w-md mx-auto">
                  <Progress value={progress} className="h-2 mb-2" />
                  <p className="text-xs text-white mt-1 text-center font-medium" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.6)' }}>
                    {completedLessons.size} of {lessons.length} lessons completed
                  </p>
                </div>
              </div>

              {/* Voice Controls */}
              <div className="mb-8">
                <CourseOverviewTTS 
                  courseTitle={courseTitle}
                  courseDescription="Build essential financial literacy skills for life success. Learn budgeting, saving, banking, and smart money decisions to secure your financial future."
                  lessons={lessons}
                />
              </div>

              {/* Additional Resources */}
              <div className="max-w-4xl mx-auto">
                <AdditionalResourcesSection>
                  <StudentGuidesAccordion
                    guideCount={15}
                    courseId="money-management-teens"
                    description="Explore our comprehensive collection of financial literacy guides and worksheets. Click any image to view in detail or open in a new tab."
                  />
                  
                  <EnhancedCourseInfoAccordion
                    title="Comprehensive Money Management Course"
                    introduction="Welcome to Money Management for Teens! This course is designed to provide you with practical financial literacy skills that will serve you throughout your life. Learn how to budget, save, invest, and make smart money decisions."
                    features={[
                      {
                        title: "Real-World Applications",
                        description: "Every lesson includes practical examples and scenarios that you'll encounter in real life, from opening your first bank account to understanding credit scores."
                      },
                      {
                        title: "Interactive Learning",
                        description: "Engage with interactive exercises, simulations, and a final decision-making game that tests your financial knowledge."
                      },
                      {
                        title: "Financial Foundations",
                        description: "Build a solid understanding of money basics, including needs vs. wants, budgeting principles, and the time value of money."
                      },
                      {
                        title: "Banking and Savings",
                        description: "Learn about different types of bank accounts, how to use them safely, and strategies for growing your savings."
                      },
                      {
                        title: "Credit and Debt Management",
                        description: "Understand how credit works, the importance of credit scores, and strategies for managing debt responsibly."
                      },
                      {
                        title: "Investment Basics",
                        description: "Get introduced to fundamental investment concepts and learn how to start building long-term wealth."
                      }
                    ]}
                    modules={[
                      { number: 1, title: "Financial Foundations", description: "Master the basic concepts of money and financial literacy" },
                      { number: 2, title: "Banking and Accounts", description: "Navigate the banking system with confidence" },
                      { number: 3, title: "Budgeting Mastery", description: "Create and maintain effective budgets" },
                      { number: 4, title: "Smart Saving Strategies", description: "Build savings habits and reach your financial goals" },
                      { number: 5, title: "Introduction to Investing", description: "Understand investment principles and opportunities" },
                      { number: 6, title: "Credit, Debt, and Future Planning", description: "Manage credit responsibly and plan for your future" },
                      { number: 7, title: "Financial Decision-Making Game", description: "Apply your knowledge in realistic scenarios" }
                    ]}
                    accordionOpen={accordionOpen}
                    onAccordionChange={setAccordionOpen}
                  />
                </AdditionalResourcesSection>
              </div>

              {/* Lessons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {lessons.map((lesson) => {
                  const isCompleted = isLessonCompleted(lesson.id);
                  const isAccessible = isLessonAccessible(lesson.id);

                  return (
                    <Card 
                      key={lesson.id}
                      className={`relative transition-all duration-200 cursor-pointer hover:shadow-lg ${
                        !isAccessible ? 'opacity-50' : ''
                      } ${isCompleted ? 'border-primary/50 bg-primary/5' : ''}`}
                      onClick={() => isAccessible && setCurrentLesson(lesson.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              isCompleted 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                            }`}>
                              {isCompleted ? <Award className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                            </div>
                            <div>
                              <Badge className={lesson.unitColor}>
                                Lesson {lesson.id}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <CardTitle className="text-lg mt-2">{lesson.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-white mb-3">{lesson.description}</p>
                        <Badge variant="outline" className={lesson.unitColor}>
                          {lesson.unit}
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                })}
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
    return <div>Lesson not found</div>;
  }

  const LessonComponent = currentLessonData.component;

  return (
    <VoiceSettingsProvider>
      <InteractiveCourseWrapper
        courseId={courseId}
        courseTitle={courseTitle}
        currentLesson={currentLesson}
        totalLessons={lessons.length}
      >
        <div className="min-h-screen bg-background" style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${moneyManagementBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}>
          <div className="flex flex-col lg:flex-row h-screen">
            {/* Progress Sidebar */}
            <aside className="w-full lg:w-80 bg-card border-r border-border overflow-y-auto">
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">{courseTitle}</h2>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {completedLessons.size} of {lessons.length} lessons completed
                  </p>
                </div>

                <div className="space-y-2">
                  {lessons.map((lesson) => {
                    const isCompleted = isLessonCompleted(lesson.id);
                    const isAccessible = isLessonAccessible(lesson.id);
                    const isCurrent = lesson.id === currentLesson;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => isAccessible && handleLessonSelect(lesson.id)}
                        disabled={!isAccessible}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          isCurrent
                            ? 'bg-primary text-primary-foreground'
                            : isCompleted
                            ? 'bg-primary/10 hover:bg-primary/20'
                            : isAccessible
                            ? 'bg-muted hover:bg-muted/80'
                            : 'bg-muted/50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {isCompleted ? (
                              <Award className="w-5 h-5" />
                            ) : (
                              <BookOpen className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{lesson.title}</p>
                            <p className="text-xs opacity-80 truncate">{lesson.unit}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => navigateToOverview()}
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  Exit to Course Overview
                </Button>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
              <InteractiveLessonWrapper
                courseId={courseId}
                lessonId={currentLesson}
                lessonTitle={currentLessonData.title}
                totalLessons={lessons.length}
                onComplete={() => handleLessonComplete(currentLesson)}
              >
                <div className="max-w-5xl mx-auto p-6">
                  <LessonComponent
                    onComplete={() => handleLessonComplete(currentLesson)}
                    onNext={currentLesson < lessons.length ? handleNextLesson : undefined}
                    hasNext={currentLesson < lessons.length}
                  />

                  {/* Navigation buttons */}
                  <div className="flex justify-between mt-8 pt-6 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={handlePrevLesson}
                      disabled={currentLesson === 1}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    <Button
                      onClick={handleNextLesson}
                      disabled={currentLesson === lessons.length}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </InteractiveLessonWrapper>
            </main>
          </div>
        </div>
      </InteractiveCourseWrapper>
    </VoiceSettingsProvider>
  );
};

export default MoneyManagementCoursePage;
