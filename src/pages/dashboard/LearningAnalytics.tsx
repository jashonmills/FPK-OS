
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Clock, Award, Target, BookOpen, Activity } from 'lucide-react';
import { useEnrolledCourses } from '@/hooks/useEnrolledCourses';
import { useEnrollmentProgress } from '@/hooks/useEnrollmentProgress';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useWeeklyActivity } from '@/hooks/useWeeklyActivity';
import { useActivityDistribution } from '@/hooks/useActivityDistribution';
import { useStreakCalculation } from '@/hooks/useStreakCalculation';
import { useTranslation } from 'react-i18next';
import AICoachEngagementCard from '@/components/analytics/AICoachEngagementCard';

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
      // This will trigger a refetch of enrollment data
      window.location.reload();
    };

    window.addEventListener('progressUpdated', handleProgressUpdate);
    return () => window.removeEventListener('progressUpdated', handleProgressUpdate);
  }, []);

  // Find the Learning State course
  const learningStateCourse = courses?.find(course => 
    course?.title?.toLowerCase().includes('learning state')
  );

  const learningStateProgress = enrollments?.find(e => e.course_id === 'learning-state-beta')?.progress;

  // Real progress data based on Learning State modules
  const completedModules = learningStateProgress?.completed_modules?.length || 0;
  const moduleTopics = [
    'Cognitive Load Theory',
    'Attention and Focus', 
    'Memory and Retention',
    'Metacognition'
  ];

  const progressData = moduleTopics.map((topic, index) => {
    const modulesPerTopic = 3.5; // 14 modules / 4 topics
    const completedInTopic = Math.min(
      Math.max(0, (completedModules) - (index * modulesPerTopic)),
      modulesPerTopic
    );
    const progress = Math.round((completedInTopic / modulesPerTopic) * 100);
    
    return {
      subject: topic,
      progress,
      color: ['#8B5CF6', '#F59E0B', '#EF4444', '#3B82F6'][index]
    };
  });

  const chartConfig = {
    studySessions: {
      label: 'Study Sessions',
      color: '#8B5CF6',
    },
    studyTime: {
      label: 'Study Time (min)',
      color: '#F59E0B',
    },
  };

  const pieChartConfig = {
    memoryPractice: {
      label: 'Memory Practice',
      color: '#8B5CF6',
    },
    multipleChoice: {
      label: 'Multiple Choice', 
      color: '#F59E0B',
    },
    timedChallenges: {
      label: 'Timed Challenges',
      color: '#3B82F6',
    },
  };

  const loading = coursesLoading || progressLoading || weeklyLoading || distributionLoading;

  if (loading) {
    return (
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Learning Analytics</h1>
          <p className="text-sm sm:text-base text-gray-600">Loading your learning analytics...</p>
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

  const overallProgress = learningStateProgress?.completion_percentage || 0;

  // Debug current day information
  const today = new Date();
  const currentDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][today.getDay()];
  
  console.log('LearningAnalytics render:', {
    today: today.toDateString(),
    currentDay: today.getDay(),
    currentDayName,
    weeklyActivityLength: weeklyActivity.length,
    weeklyActivity
  });

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="space-y-3 sm:space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Learning Analytics</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Track your progress, view insights, and analyze your learning patterns with AI-powered analytics to optimize your learning journey.
        </p>
        
        {/* Key Points */}
        <div className="space-y-2 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0"></div>
            <span>Monitor your learning progress and achievements in detail</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0"></div>
            <span>View comprehensive performance metrics and trends</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0"></div>
            <span>Get personalized AI-powered study recommendations</span>
          </div>
        </div>
      </div>

      {/* Course Banner */}
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
            <Progress value={overallProgress} className="h-2 sm:h-3 bg-white/20" />
          </CardContent>
        </Card>
      )}

      {/* Progress Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
            Overall Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm font-medium">Overall Course Completion</span>
              <span className="text-xs sm:text-sm text-gray-500">{overallProgress}% of learning goals completed</span>
            </div>
            <Progress value={overallProgress} className="h-2 sm:h-3" />
            {overallProgress > 0 ? (
              <p className="text-center text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
                Great progress! You've completed {completedModules} modules. Keep learning to advance further!
              </p>
            ) : (
              <p className="text-center text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
                Start learning to see your progress! Complete modules in the Learning State course to track your advancement.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2 sm:pb-3 p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Award className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
              Experience Points (XP)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-1 sm:mb-2">{profile?.total_xp || 0}</div>
              <p className="text-xs sm:text-sm text-gray-500">Total XP</p>
              <p className="text-xs text-gray-400 mt-1 sm:mt-2">
                {(profile?.total_xp || 0) > 0 
                  ? "Keep learning to earn more XP!" 
                  : "Complete lessons and quizzes to earn XP"
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2 sm:pb-3 p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 flex-shrink-0" />
              Learning Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-amber-600 mb-1 sm:mb-2">{currentStreak}</div>
              <p className="text-xs sm:text-sm text-gray-500">Day Streak</p>
              <p className="text-xs text-gray-400 mt-1 sm:mt-2">
                {currentStreak > 0 
                  ? "Keep up the great work!" 
                  : "Study daily to build your streak"
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Coach Engagement Card - NEW */}
      <AICoachEngagementCard />

      {/* Weekly Engagement Chart */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
            Weekly Learning Activity
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Current week (Sunday to {currentDayName}) • Only showing completed days
          </p>
        </CardHeader>
        <CardContent className="p-2 sm:p-6 pt-0">
          {weeklyActivity.length > 0 ? (
            <>
              <div className="w-full overflow-x-auto">
                <div className="min-w-[300px] w-full">
                  <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] lg:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={weeklyActivity} 
                        margin={{ 
                          top: 10, 
                          right: 10, 
                          left: 10, 
                          bottom: 10 
                        }}
                        barCategoryGap="20%"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="day" 
                          fontSize={10}
                          tick={{ fontSize: 10 }}
                          interval={0}
                        />
                        <YAxis 
                          fontSize={10}
                          tick={{ fontSize: 10 }}
                          width={30}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar 
                          dataKey="studySessions" 
                          fill="var(--color-studySessions)" 
                          radius={[2, 2, 0, 0]}
                          maxBarSize={40}
                        />
                        <Bar 
                          dataKey="studyTime" 
                          fill="var(--color-studyTime)" 
                          radius={[2, 2, 0, 0]}
                          maxBarSize={40}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
              <div className="text-center text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4 px-2">
                {weeklyActivity.some(day => day.studySessions > 0) ? (
                  <>Showing real study activity from Sunday through {currentDayName}. Future days are not displayed.</>
                ) : (
                  <>No study sessions yet this week (Sunday to {currentDayName}). Start learning to see your daily activity patterns.</>
                )}
              </div>
            </>
          ) : (
            <div className="h-[200px] sm:h-[250px] lg:h-[300px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Activity className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-gray-300" />
                <p className="font-medium text-sm sm:text-base">No activity data yet</p>
                <p className="text-xs sm:text-sm">Complete study sessions to see your weekly activity</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Overview and Activity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Learning Progress Overview */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Learning Progress Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
            {progressData.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-xs sm:text-sm mb-1 sm:mb-2">
                  <span className="font-medium">{item.subject}</span>
                  <span className="text-gray-600">{item.progress}%</span>
                </div>
                <Progress value={item.progress} className="h-1.5 sm:h-2" />
              </div>
            ))}
            {completedModules > 0 ? (
              <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
                Progress updates automatically as you complete modules in the Learning State course.
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
                Progress will update as you complete modules in the Learning State course.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Learning Activity Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" />
              Learning Activity Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-center mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm text-gray-500">
                Last 7 Days • Total: {activityDistribution.reduce((sum, item) => sum + item.value, 0)} minutes
              </p>
            </div>
            {activityDistribution.length > 0 ? (
              <>
                <ChartContainer config={pieChartConfig} className="h-[180px] sm:h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={activityDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        dataKey="value"
                      >
                        {activityDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-3 sm:mt-4 text-xs sm:text-sm">
                  {activityDistribution.map((item, index) => (
                    <div key={index} className="flex items-center gap-1 sm:gap-2">
                      <div 
                        className="w-2 h-2 sm:w-3 sm:h-3 rounded flex-shrink-0" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[180px] sm:h-[200px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Clock className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-gray-300" />
                  <p className="font-medium text-sm sm:text-base">No activity data yet</p>
                  <p className="text-xs sm:text-sm">Complete study sessions to see your activity distribution</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Study Recommendations */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
            AI Study Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="text-center py-6 sm:py-8">
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Based on your learning patterns, consider:</p>
            <div className="space-y-2 sm:space-y-3 text-left max-w-md mx-auto">
              {completedModules === 0 ? (
                <>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm text-gray-700">Starting with the Introduction to Learning State module</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm text-gray-700">Setting aside 30 minutes daily for focused learning</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm text-gray-700">Engaging with interactive elements to maximize retention</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm text-gray-700">Great progress! Continue with the next module</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm text-gray-700">Review completed modules to reinforce learning</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm text-gray-700">Maintain your learning momentum with daily sessions</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningAnalytics;
