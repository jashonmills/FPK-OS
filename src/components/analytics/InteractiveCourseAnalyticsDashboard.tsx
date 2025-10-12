import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Users, 
  Award, 
  BarChart3,
  Calendar,
  Target,
  Activity,
  Brain
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { analyticsDataSync } from '@/utils/analyticsDataSync';
import { EnrollmentData, LessonData } from '@/types/analytics-data';

interface CourseAnalytics {
  courseId: string;
  courseTitle: string;
  totalEnrollments: number;
  averageCompletion: number;
  averageTimeSpent: number;
  totalLessons: number;
  averageEngagement: number;
  completionRate: number;
}

interface LearningTrend {
  date: string;
  completions: number;
  enrollments: number;
  averageTime: number;
}

interface UserProgress {
  userId: string;
  courseId: string;
  courseTitle: string;
  completionPercentage: number;
  totalTimeSpent: number;
  averageEngagement: number;
  lastAccessed: string;
  status: 'active' | 'completed' | 'inactive';
}

export const InteractiveCourseAnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [courseAnalytics, setCourseAnalytics] = useState<CourseAnalytics[]>([]);
  const [learningTrends, setLearningTrends] = useState<LearningTrend[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Load analytics data
  useEffect(() => {
    loadAnalyticsData();
  }, [user, selectedTimeRange]);

  const loadAnalyticsData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      console.log('🔄 Loading analytics data for user:', user.id);
      
      // Run analytics data sync to fix missing data
      await analyticsDataSync.runCompleteSync(user.id);
      
      // Load course-level analytics for current user from new system
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('interactive_course_enrollments')
        .select('*')
        .eq('user_id', user.id);

      if (enrollmentError) {
        console.error('Error loading enrollments:', enrollmentError);
      } else {
        console.log('📊 Found new enrollments:', enrollmentData?.length || 0);
      }

      // Also load reading sessions and study sessions for comprehensive analytics
      const { data: readingSessions } = await supabase
        .from('reading_sessions')
        .select('*')
        .eq('user_id', user.id);

      const { data: studySessions } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id);

      console.log('📚 Found reading sessions:', readingSessions?.length || 0);
      console.log('🧠 Found study sessions:', studySessions?.length || 0);

      // Load from old enrollments table as fallback (ALL enrollments)
      const { data: oldEnrollmentData, error: oldEnrollmentError } = await supabase
        .from('enrollments')
        .select('course_id, enrolled_at, progress')
        .eq('user_id', user.id);

      if (oldEnrollmentError) {
        console.error('Error loading old enrollments:', oldEnrollmentError);
      } else {
        console.log('📚 Found old enrollments:', oldEnrollmentData?.length || 0);
      }

      // Convert old enrollments to new format with enhanced data
      const convertedEnrollments = (oldEnrollmentData || []).map(old => {
        const progress = old.progress as any;
        const completionPercentage = progress?.completion_percentage || 0;
        
        // Calculate time spent from study/reading sessions
        const courseStudyTime = (studySessions || [])
          .filter(session => session.completed_at)
          .reduce((total, session) => total + (session.session_duration_seconds || 0), 0);
        
        const courseReadingTime = (readingSessions || [])
          .reduce((total, session) => total + (session.duration_seconds || 0), 0);
        
        const totalTimeMinutes = Math.round((courseStudyTime + courseReadingTime) / 60);
        
        return {
          id: `old-${old.course_id}`,
          user_id: user.id,
          course_id: old.course_id,
          course_title: getCourseTitle(old.course_id),
          enrolled_at: old.enrolled_at,
          last_accessed_at: new Date().toISOString(),
          completion_percentage: completionPercentage,
          completed_at: completionPercentage >= 100 ? new Date().toISOString() : null,
          total_time_spent_minutes: totalTimeMinutes
        };
      });

      // Combine new and old enrollment data
      const allEnrollments = [...(enrollmentData || []), ...convertedEnrollments];
      console.log('📈 Total enrollments combined:', allEnrollments.length);

      const { data: lessonData, error: lessonError } = await supabase
        .from('interactive_lesson_analytics')
        .select('*')
        .eq('user_id', user.id);

      if (lessonError) {
        console.error('Error loading lesson data:', lessonError);
      } else {
        console.log('📚 Found lesson analytics:', lessonData?.length || 0);
      }

      // Process course analytics with combined data
      const courseStats = processCourseAnalytics(allEnrollments, lessonData || []);
      setCourseAnalytics(courseStats);
      console.log('📈 Processed course stats:', courseStats.length);

      // Load learning trends
      const trends = await loadLearningTrends(selectedTimeRange);
      setLearningTrends(trends);

      // Load user progress (for current user only)
      const progress = await loadUserProgress();
      setUserProgress(progress);
      
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCourseTitle = (courseId: string): string => {
    const titles: Record<string, string> = {
      'introduction-modern-economics': 'Introduction to Modern Economics',
      'interactive-linear-equations': 'Linear Equations Mastery', 
      'interactive-algebra': 'Algebra Fundamentals',
      'interactive-trigonometry': 'Trigonometry Fundamentals',
      'logic-critical-thinking': 'Logic & Critical Thinking',
      'interactive-science': 'Interactive Science',
      'neurodiversity-strengths-based-approach': 'Neurodiversity Strengths-Based Approach',
      'el-spelling-reading': 'EL Spelling'
    };
    return titles[courseId] || courseId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const processCourseAnalytics = (enrollments: EnrollmentData[], lessons: LessonData[]): CourseAnalytics[] => {
    const courseMap = new Map<string, any>();

    // Process enrollments
    enrollments.forEach(enrollment => {
      if (!courseMap.has(enrollment.course_id)) {
        courseMap.set(enrollment.course_id, {
          courseId: enrollment.course_id,
          courseTitle: enrollment.course_title || getCourseTitle(enrollment.course_id),
          totalEnrollments: 0,
          completions: 0,
          totalTime: 0,
          totalLessons: 0,
          engagementScores: [],
          hasActivity: false
        });
      }
      
      const course = courseMap.get(enrollment.course_id);
      course.totalEnrollments++;
      course.totalTime += enrollment.total_time_spent_minutes || 0;
      
      if (enrollment.completed_at || enrollment.completion_percentage >= 100) {
        course.completions++;
      }
      
      // Mark as having activity if there's any time spent or completion progress
      if (enrollment.total_time_spent_minutes > 0 || enrollment.completion_percentage > 0) {
        course.hasActivity = true;
      }
    });

    // Process lesson analytics
    lessons.forEach(lesson => {
      const course = courseMap.get(lesson.course_id);
      if (course) {
        course.engagementScores.push(lesson.engagement_score || 0);
        course.hasActivity = true;
        
        // Count unique lessons
        const lessonSet = course.lessonSet || new Set();
        lessonSet.add(lesson.lesson_id);
        course.lessonSet = lessonSet;
        course.totalLessons = lessonSet.size;
        
        // Add time from lesson analytics if available
        if (lesson.time_spent_seconds > 0) {
          course.totalTime += Math.round(lesson.time_spent_seconds / 60);
        }
      }
    });

    // For courses without lesson analytics, estimate engagement and lessons
    courseMap.forEach(course => {
      if (!course.hasActivity && course.totalEnrollments > 0) {
        // Estimate some basic metrics for enrolled courses without detailed analytics
        course.totalLessons = 5; // Default lesson count
        course.engagementScores = [25]; // Default low engagement for inactive courses
      }
    });

    // Convert to analytics format
    return Array.from(courseMap.values()).map(course => ({
      courseId: course.courseId,
      courseTitle: course.courseTitle,
      totalEnrollments: course.totalEnrollments,
      averageCompletion: course.totalEnrollments > 0 ? 
        Math.round((course.completions / course.totalEnrollments) * 100) : 0,
      averageTimeSpent: course.totalEnrollments > 0 ? 
        Math.round(course.totalTime / course.totalEnrollments) : 0,
      totalLessons: course.totalLessons,
      averageEngagement: course.engagementScores.length > 0 ?
        Math.round(course.engagementScores.reduce((a: number, b: number) => a + b, 0) / course.engagementScores.length) : 0,
      completionRate: course.totalEnrollments > 0 ? 
        Math.round((course.completions / course.totalEnrollments) * 100) : 0
    }));
  };

  const loadLearningTrends = async (timeRange: string): Promise<LearningTrend[]> => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: trendData } = await supabase
      .from('interactive_course_enrollments')
      .select('enrolled_at, completed_at, total_time_spent_minutes')
      .eq('user_id', user?.id)
      .gte('enrolled_at', startDate.toISOString());

    // Process trends by day
    const trendMap = new Map<string, { enrollments: number; completions: number; totalTime: number }>();
    
    (trendData || []).forEach(item => {
      const date = item.enrolled_at.split('T')[0];
      if (!trendMap.has(date)) {
        trendMap.set(date, { enrollments: 0, completions: 0, totalTime: 0 });
      }
      
      const trend = trendMap.get(date)!;
      trend.enrollments++;
      trend.totalTime += item.total_time_spent_minutes || 0;
      
      if (item.completed_at) {
        trend.completions++;
      }
    });

    return Array.from(trendMap.entries()).map(([date, data]) => ({
      date,
      completions: data.completions,
      enrollments: data.enrollments,
      averageTime: data.enrollments > 0 ? Math.round(data.totalTime / data.enrollments) : 0
    })).sort((a, b) => a.date.localeCompare(b.date));
  };

  const loadUserProgress = async (): Promise<UserProgress[]> => {
    const { data } = await supabase
      .from('interactive_course_enrollments')
      .select('*')
      .eq('user_id', user?.id);

    return (data || []).map(enrollment => {
      const daysSinceAccess = enrollment.last_accessed_at ? 
        Math.floor((new Date().getTime() - new Date(enrollment.last_accessed_at).getTime()) / (1000 * 60 * 60 * 24)) : 999;
      
      let status: 'active' | 'completed' | 'inactive' = 'inactive';
      if (enrollment.completed_at) {
        status = 'completed';
      } else if (daysSinceAccess <= 7) {
        status = 'active';
      }

      return {
        userId: enrollment.user_id,
        courseId: enrollment.course_id,
        courseTitle: enrollment.course_title,
        completionPercentage: enrollment.completion_percentage,
        totalTimeSpent: enrollment.total_time_spent_minutes,
        averageEngagement: 0, // Could be calculated from lesson analytics
        lastAccessed: enrollment.last_accessed_at,
        status
      };
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const totalEnrollments = courseAnalytics.reduce((sum, course) => sum + course.totalEnrollments, 0);
  const totalCompletions = courseAnalytics.reduce((sum, course) => 
    sum + Math.round((course.averageCompletion / 100) * course.totalEnrollments), 0);
  const averageEngagement = courseAnalytics.length > 0 ? 
    Math.round(courseAnalytics.reduce((sum, course) => sum + course.averageEngagement, 0) / courseAnalytics.length) : 0;
  const totalTimeSpent = courseAnalytics.reduce((sum, course) => 
    sum + (course.averageTimeSpent * course.totalEnrollments), 0);

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Interactive Course Analytics</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              if (user) {
                setIsLoading(true);
                try {
                  await analyticsDataSync.runCompleteSync(user.id);
                  await loadAnalyticsData(); // Reload data after sync
                } catch (error) {
                  console.error('Sync failed:', error);
                } finally {
                  setIsLoading(false);
                }
              }
            }}
            disabled={isLoading}
          >
            🔄 Sync Data
          </Button>
          {(['7d', '30d', '90d'] as const).map(range => (
            <Button
              key={range}
              variant={selectedTimeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange(range)}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Enrollments</p>
                <p className="text-2xl font-bold">{totalEnrollments.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Completions</p>
                <p className="text-2xl font-bold">{totalCompletions.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg Engagement</p>
                <p className="text-2xl font-bold">{averageEngagement}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Time</p>
                <p className="text-2xl font-bold">{Math.round(totalTimeSpent / 60)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Course Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courseAnalytics.map((course) => (
              <div key={course.courseId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{course.courseTitle}</h3>
                  <Badge variant="outline">
                    {course.totalEnrollments} enrolled
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Completion Rate</p>
                    <p className="text-lg font-semibold">{course.completionRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Time</p>
                    <p className="text-lg font-semibold">{course.averageTimeSpent}m</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Engagement</p>
                    <p className="text-lg font-semibold">{course.averageEngagement}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Lessons</p>
                    <p className="text-lg font-semibold">{course.totalLessons}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completion Progress</span>
                    <span>{course.completionRate}%</span>
                  </div>
                  <Progress value={course.completionRate} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Progress (Personal View) */}
      {userProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              My Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userProgress.map((progress) => (
                <div key={progress.courseId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{progress.courseTitle}</h3>
                    <Badge className={getStatusColor(progress.status)}>
                      {progress.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Progress</p>
                      <p className="text-lg font-semibold">{progress.completionPercentage}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Time Spent</p>
                      <p className="text-lg font-semibold">{Math.round(progress.totalTimeSpent / 60)}h {progress.totalTimeSpent % 60}m</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Last Accessed</p>
                      <p className="text-sm">{new Date(progress.lastAccessed).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Course Progress</span>
                      <span>{progress.completionPercentage}%</span>
                    </div>
                    <Progress value={progress.completionPercentage} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Trends */}
      {learningTrends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Learning Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
              {learningTrends.slice(-7).map((trend, index) => (
                <div key={trend.date} className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    {new Date(trend.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <p className="text-lg font-semibold text-green-600">{trend.completions}</p>
                  <p className="text-xs text-muted-foreground">completions</p>
                  <p className="text-sm text-blue-600">{trend.enrollments}</p>
                  <p className="text-xs text-muted-foreground">enrolled</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InteractiveCourseAnalyticsDashboard;