
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, BookOpen, MessageCircle, Target, BarChart3 } from 'lucide-react';
import RouteBoundary from '@/components/RouteBoundary';
import { useQuickStatsLive } from '@/hooks/useQuickStatsLive';
import { useFirstVisitVideo } from '@/hooks/useFirstVisitVideo';
import { FirstVisitVideoModal } from '@/components/common/FirstVisitVideoModal';
import { PageHelpTrigger } from '@/components/common/PageHelpTrigger';

// Import analytics components with error boundaries
import ReadingAnalyticsCard from '@/components/analytics/ReadingAnalyticsCard';
import AICoachEngagementCard from '@/components/analytics/AICoachEngagementCard';
import XPBreakdownCard from '@/components/analytics/XPBreakdownCard';

// Dynamic imports with error handling
const LibraryReadingAnalytics = React.lazy(() => 
  import('@/components/analytics/LibraryReadingAnalytics').catch((error) => {
    console.error('Failed to load LibraryReadingAnalytics:', error);
    return {
      default: () => (
        <div className="p-4 text-center text-gray-500">
          <p>Reading analytics unavailable</p>
        </div>
      )
    };
  })
);

const GoalsGamificationAnalytics = React.lazy(() => 
  import('@/components/analytics/GoalsGamificationAnalytics').catch((error) => {
    console.error('Failed to load GoalsGamificationAnalytics:', error);
    return {
      default: () => (
        <div className="p-4 text-center text-gray-500">
          <p>Goals analytics unavailable</p>
        </div>
      )
    };
  })
);

const AICoachAnalytics = React.lazy(() => 
  import('@/components/analytics/AICoachAnalytics').catch((error) => {
    console.error('Failed to load AICoachAnalytics:', error);
    return {
      default: () => (
        <div className="p-4 text-center text-gray-500">
          <p>AI Coach analytics unavailable</p>
        </div>
      )
    };
  })
);

const LearningAnalytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const { data: quickStats, isLoading: quickStatsLoading } = useQuickStatsLive();
  
  // Video storage hook
  const { shouldShowAuto, markVideoAsSeen } = useFirstVisitVideo('analytics_intro_seen');

  // Show video modal on first visit
  useEffect(() => {
    if (shouldShowAuto() && !quickStatsLoading) {
      setShowVideoModal(true);
    }
  }, [shouldShowAuto, quickStatsLoading]);

  const handleCloseVideo = () => {
    setShowVideoModal(false);
    markVideoAsSeen();
  };

  const handleShowVideoManually = () => {
    setShowVideoModal(true);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col items-center gap-2 mb-4">
        <h1 className="text-3xl font-bold text-foreground">Learning Analytics</h1>
        <PageHelpTrigger onOpen={handleShowVideoManually} />
      </div>
      <p className="text-muted-foreground text-center mb-6">
        Track your learning progress and insights across all activities
      </p>

      <FirstVisitVideoModal
        isOpen={showVideoModal}
        onClose={handleCloseVideo}
        title="How to Use Analytics"
        contentHtml="<iframe width='560' height='315' src='https://www.youtube.com/embed/yfKauiMPEX0?si=5oon8ri4QN3EptAX' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerpolicy='strict-origin-when-cross-origin' allowfullscreen></iframe>"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="reading" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Reading</span>
          </TabsTrigger>
          <TabsTrigger value="ai-coach" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">AI Coach</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Goals</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <RouteBoundary>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <ReadingAnalyticsCard />
              <AICoachEngagementCard />
              <XPBreakdownCard />
              <Card className="border-0 shadow-lg">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  {quickStatsLoading ? (
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="text-center">
                          <div className="h-8 bg-gray-200 rounded mb-1 animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {quickStats?.totalSessions || 0}
                        </div>
                        <p className="text-xs text-gray-500">Total Sessions</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {quickStats?.hoursLearned || 0}h
                        </div>
                        <p className="text-xs text-gray-500">Hours Learned</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                          {quickStats?.booksRead || 0}
                        </div>
                        <p className="text-xs text-gray-500">Books Read</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600 mb-1">
                          {quickStats?.goalsMet || 0}
                        </div>
                        <p className="text-xs text-gray-500">Goals Met</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </RouteBoundary>
        </TabsContent>

        <TabsContent value="reading" className="mt-6">
          <RouteBoundary>
            <React.Suspense fallback={
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            }>
              <LibraryReadingAnalytics />
            </React.Suspense>
          </RouteBoundary>
        </TabsContent>

        <TabsContent value="ai-coach" className="mt-6">
          <RouteBoundary>
            <React.Suspense fallback={
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            }>
              <AICoachAnalytics />
            </React.Suspense>
          </RouteBoundary>
        </TabsContent>

        <TabsContent value="goals" className="mt-6">
          <RouteBoundary>
            <React.Suspense fallback={
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            }>
              <GoalsGamificationAnalytics />
            </React.Suspense>
          </RouteBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningAnalytics;
