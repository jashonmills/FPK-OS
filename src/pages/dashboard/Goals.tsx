
import React from 'react';
import { GoalsDashboard } from '@/components/goals/GoalsDashboard';
import { useGoalProgressTracking } from '@/hooks/useGoalProgressTracking';
import AccessibilityErrorBoundary from '@/components/accessibility/AccessibilityErrorBoundary';

const Goals = () => {
  // Initialize automatic progress tracking
  useGoalProgressTracking();
  
  return (
    <AccessibilityErrorBoundary componentName="Goals Page">
      <div className="mobile-section-spacing">
        <div className="mb-4 sm:mb-6">
          <h1 className="mobile-heading-xl mb-2">Goals & Progress</h1>
          <p className="text-muted-foreground mobile-text-base">
            Set learning goals, track your progress, and achieve your targets with intelligent automation
          </p>
        </div>
        
        <AccessibilityErrorBoundary componentName="Goals Dashboard">
          <GoalsDashboard />
        </AccessibilityErrorBoundary>
      </div>
    </AccessibilityErrorBoundary>
  );
};

export default Goals;
