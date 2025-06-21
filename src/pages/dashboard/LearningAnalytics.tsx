import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Clock, Award, Target, BookOpen, Activity } from 'lucide-react';
import { useEnrolledCourses } from '@/hooks/useEnrolledCourses';
import { useEnrollmentProgress } from '@/hooks/useEnrollmentProgress';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useWeeklyActivity } from '@/hooks/useWeeklyActivity';
import { useActivityDistribution } from '@/hooks/useActivityDistribution';
import { useStreakCalculation } from '@/hooks/useStreakCalculation';
import { useTranslation } from 'react-i18next';

// Import enhanced analytics components
import EngagementAnalytics from '@/components/analytics/EngagementAnalytics';
import CoursesModulesAnalytics from '@/components/analytics/CoursesModulesAnalytics';
import ContentCreationAnalytics from '@/components/analytics/ContentCreationAnalytics';
import LibraryReadingAnalytics from '@/components/analytics/LibraryReadingAnalytics';
import GoalsGamificationAnalytics from '@/components/analytics/GoalsGamificationAnalytics';
import NotificationsAnalytics from '@/components/analytics/NotificationsAnalytics';
import AICoachAnalytics from '@/components/analytics/AICoachAnalytics';

// Keep existing overview components
import AICoachEngagementCard from '@/components/analytics/AICoachEngagementCard';
import ReadingAnalyticsCard from '@/components/analytics/ReadingAnalyticsCard';

const LearningAnalytics = () => {
  const { t } = useTranslation();
  const { courses, loading: coursesLoading, error: coursesError } = useEnrolledCourses();
  const { enrollments, overallStats, isLoading: progressLoading } = useEnrollmentProgress();
  const { profile } = useUserProfile();
  const { weeklyActivity, isLoading: weeklyLoading } = useWeeklyActivity();
  const { activityDistribution, isLoading: distributionLoading } = useActivityDistribution();
  const { currentStreak } = useStreakCalculation();

  // Listen for progress updates
  useEffect(() => {
    const handleProgressUpdate = () => {
      window.location.reload();
    };

    window.addEventListener('progressUpdated', handleProgressUpdate);
    return () => window.removeEventListener('progressUpdated', handleProgressUpdate);
  }, []);

  const learningStateCourse = courses?.find(course => 
    course?.title?.toLowerCase().includes('learning state')
  );

  const learningStateProgress = enrollments?.find(e => e.course_id === 'learning-state-beta')?.progress;
  const completedModules = learningStateProgress?.completed_modules?.length || 0;
  const overallProgress = learningStateProgress?.completion_percentage || 0;

  const loading = coursesLoading || progressLoading || weeklyLoading || distributionLoading;

  if (loading) {
    return (
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Learning Analytics</h1>
          <p className="text-sm sm:text-base text-gray-600">Loading your comprehensive analytics...</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="fpk-card border-0 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (coursesError) {
    return (
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Learning Analytics</h1>
          <p className="text-sm sm:text-base text-red-600">Error loading analytics: {coursesError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="space-y-3 sm:space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Comprehensive Learning Analytics</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Complete insights into your learning journey with detailed analytics across all activities.
        </p>
      </div>

      {/* Course Progress Banner */}
      {learningStateCourse && (
        <Card className="fpk-gradient text-white border-0 shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold">Learning State Progress</h2>
            </div>
            <p className="text-sm sm:text-base text-white/90 mb-3 sm:mb-4">
              You've completed {completedModules} modules ({overallProgress}% complete)
            </p>
          </CardContent>
        </Card>
      )}

      {/* Comprehensive Analytics Tabs */}
      <Tabs defaultValue="engagement" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-6">
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="ai-coach">AI Coach</TabsTrigger>
        </TabsList>
        
        <TabsContent value="engagement" className="space-y-6">
          <EngagementAnalytics />
        </TabsContent>
        
        <TabsContent value="courses" className="space-y-6">
          <CoursesModulesAnalytics />
        </TabsContent>
        
        <TabsContent value="content" className="space-y-6">
          <ContentCreationAnalytics />
        </TabsContent>
        
        <TabsContent value="library" className="space-y-6">
          <LibraryReadingAnalytics />
        </TabsContent>
        
        <TabsContent value="goals" className="space-y-6">
          <GoalsGamificationAnalytics />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <NotificationsAnalytics />
        </TabsContent>
        
        <TabsContent value="ai-coach" className="space-y-6">
          <AICoachAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningAnalytics;
