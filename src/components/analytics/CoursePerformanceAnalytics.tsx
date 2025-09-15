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
  Brain,
  Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { analyticsDataSync } from '@/utils/analyticsDataSync';

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

export const CoursePerformanceAnalytics: React.FC = () => {
  const [courseAnalytics, setCourseAnalytics] = useState<CourseAnalytics[]>([]);
  const [learningTrends, setLearningTrends] = useState<LearningTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Load analytics data for all users (admin view)
  useEffect(() => {
    loadAnalyticsData();
  }, [selectedTimeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Loading admin course analytics data');
      
      // Load all enrollments from both tables (admin view)
      const { data: newEnrollmentData, error: newEnrollmentError } = await supabase
        .from('interactive_course_enrollments')
        .select('*');

      const { data: oldEnrollmentData, error: oldEnrollmentError } = await supabase
        .from('enrollments')
        .select('course_id, enrolled_at, user_id, progress');

      if (newEnrollmentError) {
        console.error('Error loading new enrollments:', newEnrollmentError);
      }
      if (oldEnrollmentError) {
        console.error('Error loading old enrollments:', oldEnrollmentError);
      }

      // Convert old enrollments to new format
      const convertedEnrollments = (oldEnrollmentData || []).map(old => {
        const progress = old.progress as any;
        const completionPercentage = progress?.completion_percentage || 0;
        
        return {
          id: `old-${old.course_id}-${old.user_id}`,
          user_id: old.user_id,
          course_id: old.course_id,
          course_title: getCourseTitle(old.course_id),
          enrolled_at: old.enrolled_at,
          last_accessed_at: new Date().toISOString(),
          completion_percentage: completionPercentage,
          completed_at: completionPercentage >= 100 ? new Date().toISOString() : null,
          total_time_spent_minutes: 0
        };
      });

      // Combine all enrollment data
      const allEnrollments = [...(newEnrollmentData || []), ...convertedEnrollments];
      console.log('📈 Total admin enrollments:', allEnrollments.length);

      // Load all lesson analytics
      const { data: lessonData, error: lessonError } = await supabase
        .from('interactive_lesson_analytics')
        .select('*');

      if (lessonError) {
        console.error('Error loading lesson data:', lessonError);
      }

      // Process course analytics with all data
      const courseStats = processCourseAnalytics(allEnrollments, lessonData || []);
      setCourseAnalytics(courseStats);

      // Load learning trends for all users
      const trends = await loadLearningTrends(selectedTimeRange);
      setLearningTrends(trends);
      
    } catch (error) {
      console.error('Error loading admin analytics data:', error);
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
      'learning-state-beta': 'Learning State Beta',
      'el-spelling-reading': 'EL Spelling & Reading'
    };
    return titles[courseId] || courseId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const processCourseAnalytics = (enrollments: any[], lessons: any[]): CourseAnalytics[] => {
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
        
        const lessonSet = course.lessonSet || new Set();
        lessonSet.add(lesson.lesson_id);
        course.lessonSet = lessonSet;
        course.totalLessons = lessonSet.size;
        
        if (lesson.time_spent_seconds > 0) {
          course.totalTime += Math.round(lesson.time_spent_seconds / 60);
        }
      }
    });

    // Estimate metrics for courses without detailed analytics
    courseMap.forEach(course => {
      if (!course.hasActivity && course.totalEnrollments > 0) {
        course.totalLessons = 5;
        course.engagementScores = [25];
      }
    });

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
      .gte('enrolled_at', startDate.toISOString());

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
        <h2 className="text-2xl font-bold">Course Performance Analytics</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              setIsLoading(true);
              try {
                await loadAnalyticsData();
              } catch (error) {
                console.error('Sync failed:', error);
              } finally {
                setIsLoading(false);
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

      {/* Course Performance Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Course Performance Details
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

      {/* Platform Learning Trends */}
      {learningTrends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Platform Learning Trends
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

export default CoursePerformanceAnalytics;