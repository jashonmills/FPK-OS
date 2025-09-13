
import React, { useEffect, useState } from 'react';
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
import AICoachEngagementCard from '@/components/ai-coach/AICoachEngagementCard';
import AICoachPerformanceCard from '@/components/ai-coach/AICoachPerformanceCard';
import ErrorBoundary from '@/components/ErrorBoundary';
import AccessibilityErrorBoundary from '@/components/accessibility/AccessibilityErrorBoundary';
import { FirstVisitVideoModal } from '@/components/common/FirstVisitVideoModal';
import { PageHelpTrigger } from '@/components/common/PageHelpTrigger';
import { useFirstVisitVideo } from '@/hooks/useFirstVisitVideo';
import { calculateStudyStreak, generateTodaysFocus, generateQuickChallenges } from '@/utils/studyDataUtils';
import { cn } from '@/lib/utils';

const AIStudyCoach = () => {
  const { user } = useAuth();
  const { sessions } = useStudySessions();
  const { flashcards } = useFlashcards();
  const { insights } = useStudyInsights();

  // Video guide storage and modal state
  const { shouldShowAuto, markVideoAsSeen } = useFirstVisitVideo('aistudycoach_intro_seen');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Show video modal automatically on first visit
  useEffect(() => {
    if (shouldShowAuto()) {
      setIsVideoModalOpen(true);
    }
  }, [shouldShowAuto]);

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
    markVideoAsSeen();
  };

  const handleShowVideoManually = () => {
    setIsVideoModalOpen(true);
  };

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
      <div className="mobile-page-container min-h-screen overflow-x-hidden">
        {/* Header Section - Mobile First */}
        <div className="text-center mb-4 sm:mb-6 space-y-3 sm:space-y-4">
          <div className="flex flex-col items-center gap-2">
            <h1 className="mobile-heading-xl text-foreground">
              AI Learning Coach
            </h1>
            <PageHelpTrigger onOpen={handleShowVideoManually} />
          </div>
          <p className="mobile-text-base text-muted-foreground max-w-3xl mx-auto">
            Your personalized AI coach analyzes your learning patterns and provides tailored guidance.
          </p>
          
          {/* Feature Highlights - Mobile Optimized */}
          <div className="hidden sm:flex justify-center gap-4 mobile-text-sm text-muted-foreground flex-wrap">
            <span>• Personalized analysis</span>
            <span>• Proactive guidance</span>
            <span>• Continuous support</span>
          </div>
          
          {/* Mobile feature list */}
          <div className="sm:hidden space-y-1 mobile-text-xs text-muted-foreground">
            <div>• Personalized learning analysis</div>
            <div>• Proactive guidance & support</div>
            <div>• Continuous motivation</div>
          </div>
        </div>

        {/* AI Coach Status Card - Mobile First */}
        <Card className="mobile-card bg-gradient-to-r from-purple-500 to-purple-600 text-white mb-4 sm:mb-6">
          <CardContent className="mobile-card-padding">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                <Brain className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 mt-1 sm:mt-0" />
                <div className="min-w-0 flex-1">
                  <h2 className="mobile-heading-md text-white mb-1">
                    AI Learning Coach
                  </h2>
                  <p className="text-purple-100 mobile-text-sm leading-snug">
                    {completedSessions.length > 0 ? 
                      `Analyzing ${completedSessions.length} sessions & ${flashcards?.length || 0} flashcards` :
                      'Ready to analyze your learning patterns'
                    }
                  </p>
                </div>
              </div>
              
              {completedSessions.length > 0 && (
                <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:text-right gap-2 sm:gap-1">
                  <div className="flex items-center gap-2 mobile-text-base font-semibold">
                    <TrendingUp className="h-4 w-4 flex-shrink-0" />
                    <span>{overallAccuracy}% Accuracy</span>
                  </div>
                  <p className="text-purple-200 mobile-text-sm">
                    {currentStreak > 0 ? `${currentStreak} day streak!` : 'Start your streak'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Study Challenges - Mobile First */}
        <div className="mb-4 sm:mb-6">
          <AccessibilityErrorBoundary componentName="QuickChallengesCard">
            <QuickChallengesCard challenges={quickChallenges} />
          </AccessibilityErrorBoundary>
        </div>

        {/* Main Content Layout - Mobile First Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Chat Interface - Mobile First */}
          <div className="lg:col-span-2 min-w-0">
            <div className={cn(
              "mobile-card",
              fixedHeightEnabled ? "h-[70vh]" : "min-h-[500px] sm:min-h-[600px]"
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

          {/* Sidebar - Mobile First Stack */}
          <div className="space-y-4 min-w-0 pb-20 sm:pb-4">
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
            
            <AccessibilityErrorBoundary componentName="VoiceSettingsCard">
              <VoiceSettingsCard />
            </AccessibilityErrorBoundary>
            
            <AccessibilityErrorBoundary componentName="AICoachEngagementCard">
              <AICoachEngagementCard />
            </AccessibilityErrorBoundary>
            
            <AccessibilityErrorBoundary componentName="AICoachPerformanceCard">
              <AICoachPerformanceCard />
            </AccessibilityErrorBoundary>
          </div>
        </div>

        {/* Video Guide Modal */}
        <FirstVisitVideoModal
          isOpen={isVideoModalOpen}
          onClose={handleCloseVideoModal}
          title="How to Use AI Study Coach"
          videoUrl="https://www.youtube.com/embed/aNq0jxs98U0?si=-BYqBZ8-yf3lv7ow"
        />
      </div>
    </ErrorBoundary>
  );
};

export default AIStudyCoach;
