
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
import { EnhancedAIStudyCoach } from '@/components/chat/EnhancedAIStudyCoach';
import FileUploadCard from '@/components/ai-coach/FileUploadCard';
import StudyPlanCard from '@/components/ai-coach/StudyPlanCard';
import QuickChallengesCard from '@/components/ai-coach/QuickChallengesCard';
import LearningStatsCard from '@/components/ai-coach/LearningStatsCard';
import VoiceSettingsCard from '@/components/ai-coach/VoiceSettingsCard';
import AICoachEngagementCard from '@/components/ai-coach/AICoachEngagementCard';
import AICoachPerformanceCard from '@/components/ai-coach/AICoachPerformanceCard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import AccessibilityErrorBoundary from '@/components/accessibility/AccessibilityErrorBoundary';
import { FirstVisitVideoModal } from '@/components/common/FirstVisitVideoModal';
import { PageHelpTrigger } from '@/components/common/PageHelpTrigger';
import { SavedCoachChats } from '@/components/ai-coach/SavedCoachChats';
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
      {/* Main Container - Mobile-First Flexbox Layout */}
      <div className="w-full min-h-screen flex flex-col bg-background">
        
        {/* Fixed Header Section */}
        <div className="flex-shrink-0 w-full px-4 sm:px-6 lg:px-8 pt-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-6">
              <div className="flex flex-col items-center gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight break-words max-w-full px-2">
                  AI Learning Coach
                </h1>
                <PageHelpTrigger onOpen={handleShowVideoManually} />
              </div>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed">
                Your personalized AI coach analyzes your learning patterns and provides tailored guidance.
              </p>
              
              {/* Feature Highlights - Improved Mobile Layout */}
              <div className="text-xs sm:text-sm text-muted-foreground px-4">
                <div className="hidden sm:flex justify-center gap-4 flex-wrap">
                  <span>• Personalized analysis</span>
                  <span>• Proactive guidance</span>
                  <span>• Continuous support</span>
                </div>
                
                <div className="sm:hidden flex justify-center gap-3 flex-wrap leading-relaxed">
                  <span>• Analysis</span>
                  <span>• Guidance</span>
                  <span>• Support</span>
                </div>
              </div>
            </div>

            {/* AI Coach Status Card - Improved Mobile Layout */}
            <Card className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white mb-6">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col space-y-4 sm:space-y-3">
                  <div className="flex items-center gap-3">
                    <Brain className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-white leading-tight">
                        AI Learning Coach
                      </h2>
                      <p className="text-purple-100 text-xs sm:text-sm leading-snug break-words">
                        {completedSessions.length > 0 ? 
                          `${completedSessions.length} sessions • ${flashcards?.length || 0} cards analyzed` :
                          'Ready to analyze your learning'
                        }
                      </p>
                    </div>
                  </div>
                  
                  {completedSessions.length > 0 && (
                    <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-6 pt-2 border-t border-purple-400/30">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm sm:text-base font-semibold whitespace-nowrap">
                          {overallAccuracy}% Accuracy
                        </span>
                      </div>
                      <p className="text-purple-200 text-xs sm:text-sm whitespace-nowrap">
                        {currentStreak > 0 ? `${currentStreak} day streak!` : 'Start your streak'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Study Challenges */}
            <div className="w-full mb-4 sm:mb-6">
              <AccessibilityErrorBoundary componentName="QuickChallengesCard">
                <QuickChallengesCard challenges={quickChallenges} />
              </AccessibilityErrorBoundary>
            </div>
          </div>
        </div>

        {/* Main Content Area - Desktop Grid, Mobile Stack */}
        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-3 lg:gap-6 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
          <div className="max-w-7xl mx-auto w-full lg:col-span-3 flex flex-col lg:grid lg:grid-cols-3 lg:gap-6">
            
            {/* Chat Interface - Mobile: Full Width, Desktop: 2 Columns */}
            <div className="flex-1 flex flex-col lg:col-span-2 mb-6 lg:mb-0">
              <div className={cn(
                "w-full h-full flex flex-col bg-card border rounded-lg shadow-sm",
                fixedHeightEnabled ? "lg:h-[70vh]" : "min-h-[500px] sm:min-h-[600px] lg:min-h-[700px]"
              )}>
                <AccessibilityErrorBoundary componentName="EnhancedAIStudyCoach">
                  <EnhancedAIStudyCoach 
                    userId={user?.id}
                    chatMode="personal"
                    user={user}
                    completedSessions={completedSessions}
                    flashcards={flashcards}
                    insights={insights}
                    fixedHeight={fixedHeightEnabled}
                  />
                </AccessibilityErrorBoundary>
              </div>
            </div>

            {/* Sidebar Content - Mobile: Stack Below, Desktop: Right Column */}
            <div className="w-full lg:col-span-1 space-y-4 pb-20 sm:pb-4">
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
              
              <AccessibilityErrorBoundary componentName="FileUploadCard">
                <FileUploadCard />
              </AccessibilityErrorBoundary>
              
              <AccessibilityErrorBoundary componentName="SavedCoachChats">
                <SavedCoachChats />
              </AccessibilityErrorBoundary>
            </div>

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
