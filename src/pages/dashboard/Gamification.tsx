
import React from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Gamification = () => {
  const { getAccessibilityClasses } = useAccessibility();
  const [showDebug, setShowDebug] = React.useState(false);
  
  // Initialize automatic progress tracking
  useGoalProgressTracking();

  return (
    <div className={`mobile-container mobile-section-spacing ${getAccessibilityClasses('container')}`}>
      <div className="mb-4 sm:mb-6">
        <h1 className={`mobile-heading-xl mb-2 ${getAccessibilityClasses('text')}`}>
          Achievements & XP
        </h1>
        <p className={`text-muted-foreground mobile-text-base ${getAccessibilityClasses('text')}`}>
          Track your learning journey, earn XP, unlock badges, and compete with others!
        </p>
      </div>

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
