
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { GoalsDashboard } from '@/components/goals/GoalsDashboard';
import NotesSection from '@/components/notes/NotesSection';
import FileUploadSection from '@/components/notes/FileUploadSection';
import FlashcardsSection from '@/components/notes/FlashcardsSection';
import ProgressSection from '@/components/notes/ProgressSection';
import { useGoalProgressTracking } from '@/hooks/useGoalProgressTracking';
import { useAuth } from '@/hooks/useAuth';
import { useFirstVisitVideo } from '@/hooks/useFirstVisitVideo';
import { FirstVisitVideoModal } from '@/components/common/FirstVisitVideoModal';
import { PageHelpTrigger } from '@/components/common/PageHelpTrigger';
import AccessibilityErrorBoundary from '@/components/accessibility/AccessibilityErrorBoundary';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, LogIn, Target, FileText, Upload, Zap } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const GoalsAndNotes = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('goals');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const isMobile = useIsMobile();
  
  // Video storage hook - using goals intro as primary
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
          <h1 className="mobile-heading-xl mb-2">Goals & Notes</h1>
          <p className="text-muted-foreground mobile-text-base">
            Set learning goals, organize study materials, and track your progress
          </p>
        </div>
        
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
            <p className="text-gray-600 mb-4">
              Please log in to access your goals and study materials.
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
    <AccessibilityErrorBoundary componentName="Goals & Notes Page">
      <div className="max-w-7xl mx-auto mobile-container viewport-constrain">
        {/* Header */}
        <div className={cn(
          "flex flex-col items-center gap-2 mb-4",
          isMobile ? "px-3 py-2" : "px-6 py-4"
        )}>
          <h1 className={cn(
            "text-foreground text-center",
            isMobile ? "text-xl font-bold" : "text-2xl lg:text-3xl font-bold"
          )}>
            Goals & Notes
          </h1>
          <PageHelpTrigger onOpen={handleShowVideoManually} />
          <p className={cn(
            "text-muted-foreground text-center",
            isMobile ? "text-sm px-4" : "text-base"
          )}>
            Set learning goals, organize study materials, and track your progress
          </p>
        </div>

        <FirstVisitVideoModal
          isOpen={showVideoModal}
          onClose={handleCloseVideo}
          title="How to Use Goals & Notes"
          videoUrl="https://www.youtube.com/embed/eTE7_QeGAEU?si=KXgPVNvD76VFn7-5"
        />
        
        <div className={cn(
          "mobile-container",
          isMobile ? "px-3" : "px-6"
        )}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            {/* Mobile-responsive tabs list */}
            {isMobile ? (
              <ScrollArea className="w-full">
                <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground min-w-max">
                  <TabsTrigger value="goals" className="flex items-center gap-2 whitespace-nowrap">
                    <Target className="h-4 w-4" />
                    Goals
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="flex items-center gap-2 whitespace-nowrap">
                    <FileText className="h-4 w-4" />
                    Notes
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="flex items-center gap-2 whitespace-nowrap">
                    <Upload className="h-4 w-4" />
                    Upload
                  </TabsTrigger>
                  <TabsTrigger value="flashcards" className="flex items-center gap-2 whitespace-nowrap">
                    <Zap className="h-4 w-4" />
                    Flashcards
                  </TabsTrigger>
                  <TabsTrigger value="progress" className="flex items-center gap-2 whitespace-nowrap">
                    Progress
                  </TabsTrigger>
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ) : (
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="goals" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Goals
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Notes
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="flashcards" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Flashcards
                </TabsTrigger>
                <TabsTrigger value="progress" className="flex items-center gap-2">
                  Progress
                </TabsTrigger>
              </TabsList>
            )}

            <div className="min-h-0 flex-1 mobile-content-width">
              <TabsContent value="goals" className="mt-4 mobile-safe-padding">
                <AccessibilityErrorBoundary componentName="Goals Dashboard">
                  <GoalsDashboard />
                </AccessibilityErrorBoundary>
              </TabsContent>

              <TabsContent value="notes" className="mt-4 mobile-safe-padding">
                <NotesSection />
              </TabsContent>

              <TabsContent value="upload" className="mt-4 mobile-safe-padding">
                <FileUploadSection />
              </TabsContent>

              <TabsContent value="flashcards" className="mt-4 mobile-safe-padding">
                <FlashcardsSection />
              </TabsContent>

              <TabsContent value="progress" className="mt-4 mobile-safe-padding">
                <ProgressSection />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </AccessibilityErrorBoundary>
  );
};

export default GoalsAndNotes;
