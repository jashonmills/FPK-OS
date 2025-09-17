
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoalsDashboard } from '@/components/goals/GoalsDashboard';
import { useGoalProgressTracking } from '@/hooks/useGoalProgressTracking';
import { useAuth } from '@/hooks/useAuth';
import { useFirstVisitVideo } from '@/hooks/useFirstVisitVideo';
import { FirstVisitVideoModal } from '@/components/common/FirstVisitVideoModal';
import { PageHelpTrigger } from '@/components/common/PageHelpTrigger';
import AccessibilityErrorBoundary from '@/components/accessibility/AccessibilityErrorBoundary';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, LogIn, HelpCircle } from 'lucide-react';

const Goals = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showVideoModal, setShowVideoModal] = useState(false);
  
  // Video storage hook
  const { shouldShowAuto, markVideoAsSeen } = useFirstVisitVideo('goals_intro_seen');
  
  // Initialize automatic progress tracking
  useGoalProgressTracking();

  // Show video modal on first visit (only when authenticated)
  useEffect(() => {
    if (shouldShowAuto() && !authLoading && user) {
      setShowVideoModal(true);
    }
  }, [shouldShowAuto, authLoading, user]);

  const handleCloseVideo = () => {
    setShowVideoModal(false);
    markVideoAsSeen();
  };

  const handleShowVideoManually = () => {
    setShowVideoModal(true);
  };
  
  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="mobile-section-spacing">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <div className="ml-3 text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }
  
  // Show authentication required message if user is not logged in
  if (!user) {
    return (
      <div className="mobile-section-spacing">
        <div className="mb-4 sm:mb-6">
          <h1 className="mobile-heading-xl mb-2">Goals & Progress</h1>
          <p className="text-muted-foreground mobile-text-base">
            Set learning goals, track your progress, and achieve your targets with intelligent automation
          </p>
        </div>
        
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
            <p className="text-gray-600 mb-4">
              Please log in to access your goals and track your learning progress.
            </p>
            <Button 
              onClick={() => navigate('/login')}
              className="fpk-gradient text-white"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <AccessibilityErrorBoundary componentName="Goals Page">
      <div className="mobile-section-spacing">
        <div className="flex flex-col items-center gap-2 mb-4 sm:mb-6">
          <h1 className="mobile-heading-xl mb-2">Goals & Progress</h1>
          <PageHelpTrigger onOpen={handleShowVideoManually} />
          <p className="text-muted-foreground mobile-text-base text-center">
            Set learning goals, track your progress, and achieve your targets with intelligent automation
          </p>
        </div>

        <FirstVisitVideoModal
          isOpen={showVideoModal}
          onClose={handleCloseVideo}
          title="How to Use Goals"
          videoUrl="https://www.youtube.com/embed/eTE7_QeGAEU?si=KXgPVNvD76VFn7-5"
        />
        
        <AccessibilityErrorBoundary componentName="Goals Dashboard">
          <GoalsDashboard />
        </AccessibilityErrorBoundary>
      </div>
    </AccessibilityErrorBoundary>
  );
};

export default Goals;
