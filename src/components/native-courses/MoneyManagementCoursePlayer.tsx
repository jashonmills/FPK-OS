import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle, Menu, X, BookOpen } from 'lucide-react';
import CourseHeader from '@/components/course/CourseHeader';
import { useUnifiedProgressTracking } from '@/hooks/useUnifiedProgressTracking';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

// Import all Money Management micro-lessons
import { FinancialFoundationsMicroLesson } from '@/components/micro-lessons/money-management/FinancialFoundationsMicroLesson';
import { BankingAccountsMicroLesson } from '@/components/micro-lessons/money-management/BankingAccountsMicroLesson';
import { BudgetingMasteryMicroLesson } from '@/components/micro-lessons/money-management/BudgetingMasteryMicroLesson';
import { SavingStrategiesMicroLesson } from '@/components/micro-lessons/money-management/SavingStrategiesMicroLesson';
import { CreditDebtPlanningMicroLesson } from '@/components/micro-lessons/money-management/CreditDebtPlanningMicroLesson';
import { InvestingBasicsMicroLesson } from '@/components/micro-lessons/money-management/InvestingBasicsMicroLesson';
import { MoneyManagementGameMicroLesson } from '@/components/micro-lessons/money-management/MoneyManagementGameMicroLesson';

interface LessonDefinition {
  id: number;
  slug: string;
  title: string;
  description: string;
  component: React.ComponentType<{
    onComplete?: () => void;
    onNext?: () => void;
    hasNext?: boolean;
  }>;
}

const LESSONS: LessonDefinition[] = [
  {
    id: 1,
    slug: 'financial-foundations',
    title: 'Financial Foundations',
    description: 'Understanding money, income, expenses, and financial goals',
    component: FinancialFoundationsMicroLesson
  },
  {
    id: 2,
    slug: 'banking-and-accounts',
    title: 'Banking and Accounts',
    description: 'Learn about different types of bank accounts and how to use them',
    component: BankingAccountsMicroLesson
  },
  {
    id: 3,
    slug: 'budgeting-mastery',
    title: 'Budgeting Mastery',
    description: 'Master the art of creating and sticking to a budget',
    component: BudgetingMasteryMicroLesson
  },
  {
    id: 4,
    slug: 'saving-strategies',
    title: 'Saving Strategies',
    description: 'Effective strategies for building savings and emergency funds',
    component: SavingStrategiesMicroLesson
  },
  {
    id: 5,
    slug: 'credit-and-debt',
    title: 'Credit and Debt Planning',
    description: 'Understanding credit, debt, and how to manage both responsibly',
    component: CreditDebtPlanningMicroLesson
  },
  {
    id: 6,
    slug: 'investing-basics',
    title: 'Investing Basics',
    description: 'Introduction to investing and growing your wealth',
    component: InvestingBasicsMicroLesson
  },
  {
    id: 7,
    slug: 'money-management-game',
    title: 'Money Management Challenge',
    description: 'Apply what you\'ve learned in an interactive simulation',
    component: MoneyManagementGameMicroLesson
  }
];

const COURSE_ID = 'money-management-teens';
const COURSE_TITLE = 'Money Management for Teens';

export default function MoneyManagementCoursePlayer() {
  const navigate = useNavigate();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentLesson = LESSONS[currentLessonIndex];
  const canGoPrevious = currentLessonIndex > 0;
  const canGoNext = currentLessonIndex < LESSONS.length - 1;
  const isLastLesson = currentLessonIndex === LESSONS.length - 1;
  const isLessonCompleted = completedLessons.has(currentLesson.id);

  // Unified progress tracking
  const {
    trackInteraction,
    trackLessonCompletion,
    trackCourseCompletion,
    totalTimeSpent,
    sessionActive
  } = useUnifiedProgressTracking(
    COURSE_ID,
    COURSE_TITLE,
    currentLesson.slug,
    currentLesson.title
  );

  // Load completed lessons from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(`course-progress-${COURSE_ID}`);
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setCompletedLessons(new Set(progress.completedLessons || []));
        if (progress.currentLessonIndex !== undefined) {
          setCurrentLessonIndex(progress.currentLessonIndex);
        }
      } catch (error) {
        console.error('Error loading course progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    const progress = {
      currentLessonIndex,
      completedLessons: Array.from(completedLessons)
    };
    localStorage.setItem(`course-progress-${COURSE_ID}`, JSON.stringify(progress));
  }, [currentLessonIndex, completedLessons]);

  const handlePreviousLesson = () => {
    if (canGoPrevious) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      trackInteraction('lesson_navigation', {
        action: 'previous',
        fromLessonId: currentLesson.slug,
        toLessonId: LESSONS[currentLessonIndex - 1].slug
      });
    }
  };

  const handleNextLesson = () => {
    if (canGoNext) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      trackInteraction('lesson_navigation', {
        action: 'next',
        fromLessonId: currentLesson.slug,
        toLessonId: LESSONS[currentLessonIndex + 1].slug
      });
    }
  };

  const handleCompleteLesson = async () => {
    try {
      // Track lesson completion
      await trackLessonCompletion(currentLesson.slug, currentLesson.title);
      
      // Mark lesson as completed
      const newCompletedLessons = new Set(completedLessons);
      newCompletedLessons.add(currentLesson.id);
      setCompletedLessons(newCompletedLessons);

      toast.success('Lesson completed!');
      
      // Check if course is complete
      if (isLastLesson && newCompletedLessons.size === LESSONS.length) {
        await trackCourseCompletion();
        toast.success('Congratulations! You\'ve completed the entire course!');
      }
      
      // Auto-advance to next lesson if not the last
      if (!isLastLesson) {
        setTimeout(() => {
          handleNextLesson();
        }, 1000);
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
      toast.error('Failed to update progress');
    }
  };

  const handleLessonSelect = (index: number) => {
    setCurrentLessonIndex(index);
    trackInteraction('lesson_selected', {
      lessonId: LESSONS[index].slug,
      lessonTitle: LESSONS[index].title
    });
  };

  const handleExit = () => {
    navigate('/dashboard/learner/courses');
  };

  const progressPercentage = Math.round((completedLessons.size / LESSONS.length) * 100);

  const LessonComponent = currentLesson.component;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'w-80' : 'w-0'} overflow-hidden border-r bg-card`}>
        <div className="h-full flex flex-col p-4">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Course Progress</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium">{completedLessons.size} / {LESSONS.length}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="fpk-gradient h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <h3 className="text-sm font-medium mb-3 text-muted-foreground">Lessons</h3>
            <div className="space-y-2">
              {LESSONS.map((lesson, index) => {
                const isCompleted = completedLessons.has(lesson.id);
                const isCurrent = index === currentLessonIndex;
                
                return (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonSelect(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      isCurrent 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary/50 hover:bg-secondary'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium opacity-70">
                            Lesson {lesson.id}
                          </span>
                          {isCompleted && (
                            <CheckCircle className="h-3 w-3" />
                          )}
                        </div>
                        <div className="font-medium text-sm mt-1">
                          {lesson.title}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <CourseHeader title={COURSE_TITLE} />
        
        {/* Course Info Bar */}
        <div className="border-b bg-card px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
              <div>
                <p className="text-sm text-muted-foreground">
                  Lesson {currentLessonIndex + 1} of {LESSONS.length}: {currentLesson.title}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-muted-foreground">
                {progressPercentage}% Complete
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div onClick={() => trackInteraction('lesson_content_interaction')}>
            <LessonComponent
              onComplete={handleCompleteLesson}
              onNext={handleNextLesson}
              hasNext={canGoNext}
            />
          </div>
        </main>

        {/* Navigation Footer */}
        <footer className="border-t bg-card p-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={handlePreviousLesson}
              disabled={!canGoPrevious}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-3">
              {!isLessonCompleted && (
                <Button onClick={handleCompleteLesson} className="fpk-gradient">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Lesson
                </Button>
              )}
              
              {isLessonCompleted && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
              )}
            </div>

            <Button 
              onClick={handleNextLesson}
              disabled={!canGoNext}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
