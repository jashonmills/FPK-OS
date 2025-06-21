
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Target, Clock, TrendingUp } from 'lucide-react';
import { useEnrolledCourses } from '@/hooks/useEnrolledCourses';
import { useEnrollmentProgress } from '@/hooks/useEnrollmentProgress';
import EmptyState from '@/components/analytics/EmptyState';

const CoursesModulesAnalytics = () => {
  const { courses, loading: coursesLoading } = useEnrolledCourses();
  const { enrollments, overallStats, isLoading: progressLoading } = useEnrollmentProgress();

  const loading = coursesLoading || progressLoading;

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const learningStateProgress = enrollments?.find(e => e.course_id === 'learning-state-beta')?.progress;
  const completedModules = learningStateProgress?.completed_modules?.length || 0;
  const totalModules = 14; // Learning State has 14 modules

  // Module topics based on Learning State course structure
  const moduleTopics = [
    'Introduction to Learning State',
    'Cognitive Load Theory',
    'Attention and Focus', 
    'Memory and Retention',
    'Metacognition',
    'Learning Strategies',
    'Environmental Factors',
    'Motivation & Engagement'
  ];

  const progressData = moduleTopics.map((topic, index) => {
    const modulesPerTopic = totalModules / moduleTopics.length;
    const completedInTopic = Math.min(
      Math.max(0, completedModules - (index * modulesPerTopic)),
      modulesPerTopic
    );
    const progress = Math.round((completedInTopic / modulesPerTopic) * 100);
    
    return {
      topic,
      progress,
      completed: completedInTopic,
      total: modulesPerTopic
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Module Completion Funnel */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
            Module Completion Funnel
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Progress through Learning State modules
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-4">
            {progressData.slice(0, 6).map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-xs sm:text-sm mb-1 sm:mb-2">
                  <span className="font-medium">{item.topic}</span>
                  <span className="text-gray-600">{item.progress}%</span>
                </div>
                <Progress value={item.progress} className="h-1.5 sm:h-2" />
              </div>
            ))}
            {completedModules > 0 ? (
              <p className="text-xs text-gray-500 mt-3">
                {completedModules} of {totalModules} modules completed
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-3">
                Start the Learning State course to see module progress
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Course Performance Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
            Course Performance
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Overall course completion metrics
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {courses?.length || 0}
              </div>
              <p className="text-sm text-gray-500">Enrolled Courses</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {Math.round(learningStateProgress?.completion_percentage || 0)}%
              </div>
              <p className="text-sm text-gray-500">Average Completion</p>
            </div>

            <div className="text-center">
              <div className="text-xl font-bold text-purple-600 mb-2">
                {completedModules}
              </div>
              <p className="text-sm text-gray-500">Modules Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Time Analysis */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" />
            Module Time Analysis
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Time spent on different modules
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <EmptyState 
            icon={Clock}
            title="Time Tracking Coming Soon"
            description="Detailed time analysis per module will help identify which topics need more focus"
          />
        </CardContent>
      </Card>

      {/* Learning Difficulty Analysis */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
            Learning Difficulty Trends
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Modules that require more attention
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <EmptyState 
            icon={TrendingUp}
            title="Difficulty Analysis Coming Soon"
            description="AI-powered analysis will identify which modules are most challenging and suggest personalized learning paths"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CoursesModulesAnalytics;
