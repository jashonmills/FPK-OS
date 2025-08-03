
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Brain, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useStudyInsights } from '@/hooks/useStudyInsights';
import { useProactiveCoaching } from '@/hooks/useProactiveCoaching';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import { featureFlagService } from '@/services/FeatureFlagService';
import AdvancedChatInterface from '@/components/ai-coach/AdvancedChatInterface';
import FileUploadCard from '@/components/ai-coach/FileUploadCard';
import StudyPlanCard from '@/components/ai-coach/StudyPlanCard';
import QuickChallengesCard from '@/components/ai-coach/QuickChallengesCard';
import LearningStatsCard from '@/components/ai-coach/LearningStatsCard';
import VoiceSettingsCard from '@/components/ai-coach/VoiceSettingsCard';
import ErrorBoundary from '@/components/ErrorBoundary';
import AccessibilityErrorBoundary from '@/components/accessibility/AccessibilityErrorBoundary';
import { calculateStudyStreak, generateTodaysFocus, generateQuickChallenges } from '@/utils/studyDataUtils';
import { cn } from '@/lib/utils';

const AIStudyCoach = () => {
  const { user } = useAuth();
  const { sessions } = useStudySessions();
  const { flashcards } = useFlashcards();
  const { insights } = useStudyInsights();

  // Add scroll restoration for better navigation UX
  useScrollRestoration('ai-coach-scroll');

  // Enable proactive coaching with proper error handling - TEMPORARILY DISABLED
  // useProactiveCoaching();

  const fixedHeightEnabled = featureFlagService.isEnabled('aiCoachFixedHeight');

  // Safe data processing with null checks
  const completedSessions = sessions?.filter(s => s?.completed_at) || [];
  const totalXP = completedSessions.reduce((sum, s) => sum + ((s?.correct_answers || 0) * 10), 0);
  const currentStreak = calculateStudyStreak(completedSessions);
  const progressToNextLevel = (totalXP % 1000) / 10;

  // Safe performance metrics calculation
  const totalCorrect = completedSessions.reduce((sum, s) => sum + (s?.correct_answers || 0), 0);
  const totalAnswered = completedSessions.reduce((sum, s) => sum + (s?.total_cards || 0), 0);
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // Safe dynamic content generation
  const todaysFocus = generateTodaysFocus(insights, flashcards, completedSessions);
  const quickChallenges = generateQuickChallenges(flashcards, completedSessions);

  if (!user) {
    return (
      <div className="responsive-container responsive-spacing min-h-screen">
        <div className="text-center py-8">
          <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Please log in</h3>
          <p className="text-sm text-gray-500">
            You need to be logged in to access the AI Study Coach.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="responsive-container responsive-spacing min-h-screen overflow-x-hidden">
        {/* Header Section - Fully Responsive */}
        <div className="text-center responsive-spacing max-w-full flex-shrink-0">
          <h1 className="responsive-heading font-bold text-foreground break-words leading-tight">
            AI Learning Coach
          </h1>
          <p className="responsive-text text-muted-foreground max-w-4xl mx-auto leading-relaxed break-words">
            Your personalized AI coach analyzes your learning patterns, identifies strengths and weaknesses, 
            and provides tailored guidance to accelerate your educational journey.
          </p>
          
          {/* Feature Highlights - Responsive Layout */}
          <div className="hidden sm:flex justify-center gap-2 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-muted-foreground flex-wrap mt-4">
            <span className="break-words text-center">• Personalized learning analysis</span>
            <span className="break-words text-center">• Proactive guidance</span>
            <span className="break-words text-center">• Continuous support</span>
          </div>
          
          {/* Mobile-friendly feature list */}
          <div className="sm:hidden mt-4 space-y-1 text-xs text-muted-foreground">
            <div className="break-words">• Personalized learning analysis</div>
            <div className="break-words">• Proactive guidance and support</div>
            <div className="break-words">• Continuous motivation</div>
          </div>
        </div>

        {/* AI Coach Status Card - Enhanced Mobile Layout */}
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 w-full overflow-hidden flex-shrink-0">
          <CardContent className="responsive-card-padding">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <Brain className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 flex-shrink-0 mt-0.5 sm:mt-0" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold break-words leading-tight">
                    AI Learning Coach
                  </h2>
                  <p className="text-purple-100 text-xs sm:text-sm lg:text-base leading-snug break-words mt-1">
                    {completedSessions.length > 0 ? 
                      `Analyzing your ${completedSessions.length} study sessions and ${flashcards?.length || 0} flashcards` :
                      'Ready to analyze your learning patterns once you start studying'
                    }
                  </p>
                </div>
              </div>
              
              {completedSessions.length > 0 && (
                <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:text-right gap-2 sm:gap-1 flex-shrink-0">
                  <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base lg:text-lg font-semibold">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                    <span className="break-words">{overallAccuracy}% Accuracy</span>
                  </div>
                  <p className="text-purple-200 text-xs sm:text-sm break-words">
                    {currentStreak > 0 ? `${currentStreak} day streak!` : 'Start your streak today'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Study Challenges - Mobile Optimized */}
        <div className="flex-shrink-0">
          <AccessibilityErrorBoundary componentName="QuickChallengesCard">
            <QuickChallengesCard challenges={quickChallenges} />
          </AccessibilityErrorBoundary>
        </div>

        {/* Main Content Layout - Responsive Grid with Height Constraint Only for Chat */}
        <div className={cn(
          "grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 w-full",
          fixedHeightEnabled ? "min-h-[70vh]" : ""
        )}>
          {/* Chat Interface - Takes 2/3 on desktop, full width on mobile */}
          <div className={cn(
            "lg:col-span-2 min-w-0 w-full",
            fixedHeightEnabled ? "flex flex-col" : ""
          )}>
            <div className={cn(
              fixedHeightEnabled ? "h-[70vh] min-h-0" : "min-h-[600px]"
            )}>
              <AccessibilityErrorBoundary componentName="AdvancedChatInterface">
                <AdvancedChatInterface 
                  user={user}
                  completedSessions={completedSessions}
                  flashcards={flashcards}
                  insights={insights}
                />
              </AccessibilityErrorBoundary>
            </div>
          </div>

          {/* Right Sidebar - Stacks on mobile, sidebar on desktop */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6 min-w-0 w-full flex-shrink-0">
            <AccessibilityErrorBoundary componentName="VoiceSettingsCard">
              <VoiceSettingsCard />
            </AccessibilityErrorBoundary>
            
            <AccessibilityErrorBoundary componentName="FileUploadCard">
              <FileUploadCard />
            </AccessibilityErrorBoundary>
            
            <AccessibilityErrorBoundary componentName="StudyPlanCard">
              <StudyPlanCard todaysFocus={todaysFocus} />
            </AccessibilityErrorBoundary>
            
            <AccessibilityErrorBoundary componentName="LearningStatsCard">
              <LearningStatsCard
                totalXP={totalXP}
                currentStreak={currentStreak}
                progressToNextLevel={progressToNextLevel}
              />
            </AccessibilityErrorBoundary>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AIStudyCoach;
