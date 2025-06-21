
import React from 'react';
import { GoalsDashboard } from '@/components/goals/GoalsDashboard';
import { useGoalProgressTracking } from '@/hooks/useGoalProgressTracking';
import ErrorBoundary from '@/components/ErrorBoundary';

const Goals = () => {
  // Initialize automatic progress tracking
  useGoalProgressTracking();
  
  return (
    <ErrorBoundary>
      <div className="mobile-section-spacing">
        <div className="mb-4 sm:mb-6">
          <h1 className="mobile-heading-xl mb-2">Goals & Progress</h1>
          <p className="text-muted-foreground mobile-text-base">
            Set learning goals, track your progress, and achieve your targets with intelligent automation
          </p>
        </div>
        
        <ErrorBoundary>
          <GoalsDashboard />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
};

export default Goals;
