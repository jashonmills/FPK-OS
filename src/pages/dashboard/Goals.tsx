
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';
import { GoalsDashboard } from '@/components/goals/GoalsDashboard';
import { useGoalProgressTracking } from '@/hooks/useGoalProgressTracking';
import { useAnalyticsPublisher } from '@/hooks/useAnalyticsEventBus';
import AccessibilityErrorBoundary from '@/components/accessibility/AccessibilityErrorBoundary';
import DualLanguageText from '@/components/DualLanguageText';

const Goals = () => {
  // Initialize automatic progress tracking
  useGoalProgressTracking();
  
  // Analytics tracking
  const analytics = useAnalyticsPublisher();
  const pageEntryTime = useRef<number>(Date.now());
  
  useEffect(() => {
    // Track page view
    analytics.publishPageView('goals', {
      section: 'learner_dashboard',
      timestamp: pageEntryTime.current
    });
    
    // Track page exit when component unmounts
    return () => {
      const timeSpent = Math.round((Date.now() - pageEntryTime.current) / 1000);
      analytics.publishPageExit('goals', timeSpent, {
        section: 'learner_dashboard'
      });
    };
  }, [analytics]);
  
  return (
    <AccessibilityErrorBoundary componentName="Goals Page">
      <div className="mobile-section-spacing">
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="mobile-heading-xl">Goals & Progress</h1>
            <Link to="/dashboard/learner/goals/insights">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <DualLanguageText translationKey="goals.insights.view" fallback="View Insights" />
              </Button>
            </Link>
          </div>
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
