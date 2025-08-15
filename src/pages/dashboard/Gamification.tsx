
import React, { useState, useEffect } from 'react';
import GamificationDashboard from '@/components/gamification/GamificationDashboard';
import GoalXPTracker from '@/components/goals/GoalXPTracker';
import GoalReminders from '@/components/goals/GoalReminders';
import ActiveLearningGoals from '@/components/goals/ActiveLearningGoals';
import SimpleGoalsOverview from '@/components/goals/SimpleGoalsOverview';
import ReadingProgressWidgetErrorBoundary from '@/components/goals/ReadingProgressWidgetErrorBoundary';
import ReadingProgressWidget from '@/components/goals/ReadingProgressWidget';
import GoalDebugOverlay from '@/components/goals/GoalDebugOverlay';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useGoalProgressTracking } from '@/hooks/useGoalProgressTracking';
import { useAchievementsVideoStorage } from '@/hooks/useAchievementsVideoStorage';
import { AchievementsVideoModal } from '@/components/gamification/AchievementsVideoModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

const Gamification = () => {
  const { getAccessibilityClasses } = useAccessibility();
  const [showDebug, setShowDebug] = React.useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  
  // Video storage hook
  const { shouldShowAuto, markVideoAsSeen } = useAchievementsVideoStorage();
  
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
      <div className="flex justify-between items-start mb-4 sm:mb-6">
        <div>
          <h1 className={`mobile-heading-xl mb-2 ${getAccessibilityClasses('text')}`}>
            Achievements & XP
          </h1>
          <p className={`text-muted-foreground mobile-text-base ${getAccessibilityClasses('text')}`}>
            Track your learning journey, earn XP, unlock badges, and compete with others!
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShowVideoManually}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <HelpCircle className="h-4 w-4" />
          How this page works
        </Button>
      </div>

      <AchievementsVideoModal
        isOpen={showVideoModal}
        onClose={handleCloseVideo}
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

      {/* Debug overlay for development */}
      <GoalDebugOverlay
        show={showDebug}
        onToggle={() => setShowDebug(!showDebug)}
      />
    </div>
  );
};

export default Gamification;
