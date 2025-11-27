
import React, { useState, useEffect } from 'react';
import GamificationDashboard from '@/components/gamification/GamificationDashboard';
import GoalXPTracker from '@/components/goals/GoalXPTracker';
import GoalReminders from '@/components/goals/GoalReminders';
import ActiveLearningGoals from '@/components/goals/ActiveLearningGoals';
import SimpleGoalsOverview from '@/components/goals/SimpleGoalsOverview';
import ReadingProgressWidgetErrorBoundary from '@/components/goals/ReadingProgressWidgetErrorBoundary';
import ReadingProgressWidget from '@/components/goals/ReadingProgressWidget';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useGoalProgressTracking } from '@/hooks/useGoalProgressTracking';
import { useFirstVisitVideo } from '@/hooks/useFirstVisitVideo';
import { FirstVisitVideoModal } from '@/components/common/FirstVisitVideoModal';
import { PageHelpTrigger } from '@/components/common/PageHelpTrigger';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const Gamification = () => {
  const { getAccessibilityClasses } = useAccessibility();
  const [showVideoModal, setShowVideoModal] = useState(false);
  
  // Video storage hook
  const { shouldShowAuto, markVideoAsSeen } = useFirstVisitVideo('achievements_intro_seen');
  
  // Initialize automatic progress tracking
  useGoalProgressTracking();

  // Show video modal on first visit
  useEffect(() => {
    if (shouldShowAuto()) {
      setShowVideoModal(true);
    }
  }, [shouldShowAuto]);

  const handleCloseVideo = () => {
    setShowVideoModal(false);
    markVideoAsSeen();
  };

  const handleShowVideoManually = () => {
    setShowVideoModal(true);
  };

  return (
    <div className={`mobile-container mobile-section-spacing ${getAccessibilityClasses('container')}`}>
      <div className="flex flex-col items-center gap-2 mb-4 sm:mb-6">
        <h1 className={`mobile-heading-xl ${getAccessibilityClasses('text')}`}>
          Achievements & XP
        </h1>
        <PageHelpTrigger onOpen={handleShowVideoManually} />
      </div>
      <p className={`text-muted-foreground mobile-text-base text-center mb-6 ${getAccessibilityClasses('text')}`}>
        Track your learning journey, earn XP, unlock badges, and compete with others!
      </p>

      <FirstVisitVideoModal
        isOpen={showVideoModal}
        onClose={handleCloseVideo}
        title="How to Use Achievements"
        videoUrl="https://www.youtube.com/embed/lR1a6nzyU3o?si=c44zioJi_gDnxNcU"
      />

      {/* Goal & XP Tracker - Prominent Card */}
      <div className="mb-6">
        <GoalXPTracker />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="goals">My Goals</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="goals" className="space-y-6">
          {/* Goals Overview Stats */}
          <SimpleGoalsOverview />
          
          {/* Active Learning Goals - with integrated create goal functionality */}
          <ActiveLearningGoals />
          
          {/* Reading Progress Widget and Goal Reminders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ReadingProgressWidgetErrorBoundary>
                <ReadingProgressWidget />
              </ReadingProgressWidgetErrorBoundary>
            </div>
            <div className="lg:col-span-2">
              <GoalReminders />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="achievements">
          <GamificationDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Gamification;
