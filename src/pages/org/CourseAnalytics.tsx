import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, TrendingUp, Users, Clock, BarChart3 } from 'lucide-react';
import { useOrgPermissions } from '@/hooks/useOrgPermissions';

interface Course {
  id: string;
  title: string;
  description?: string;
  instructor_name?: string;
  duration_minutes?: number;
  difficulty_level?: string;
  status: string;
}

interface AnalyticsData {
  totalEnrollments: number;
  completionRate: number;
  averageTimeSpent: number;
  lastWeekActivity: number;
}

export default function CourseAnalytics() {
  const { orgId, courseId } = useParams<{ orgId: string; courseId: string }>();
  const navigate = useNavigate();
  const { canViewOrgAnalytics } = useOrgPermissions();
  const [course, setCourse] = useState<Course | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canViewOrgAnalytics()) {
      setError('Insufficient permissions to view analytics');
      setLoading(false);
      return;
    }

    if (!courseId || !orgId) {
      setError('Missing course or organization ID');
      setLoading(false);
      return;
    }

    loadCourseAnalytics();
  }, [courseId, orgId, canViewOrgAnalytics]);

  const loadCourseAnalytics = async () => {
    try {
      // Load course data
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('id, title, description, instructor_name, duration_minutes, difficulty_level, status')
        .eq('id', courseId)
        .maybeSingle();

      if (courseError) {
        throw courseError;
      }

      if (!courseData) {
        // Try org_courses if not found in courses (note: org_courses may have limited fields)
        const { data: orgCourseData, error: orgCourseError } = await supabase
          .from('org_courses')
          .select('id, title, description, status')
          .eq('id', courseId)
          .eq('org_id', orgId)
          .maybeSingle();

        if (orgCourseError) {
          throw orgCourseError;
        }

        if (!orgCourseData) {
          throw new Error('Course not found');
        }
        
        setCourse({
          id: orgCourseData.id,
          title: orgCourseData.title,
          description: orgCourseData.description,
          duration_minutes: undefined, // not available in org_courses
          difficulty_level: 'beginner', // default
          status: orgCourseData.status,
          instructor_name: undefined, // not available in org_courses
        });
      } else {
        setCourse(courseData);
      }

      // Load analytics data - using course_progress instead of enrollments
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('course_progress')
        .select('user_id, percent, updated_at')
        .eq('course_id', courseId);

      if (enrollmentError) {
        console.warn('Failed to load enrollment data:', enrollmentError);
      }

      // Load lesson analytics
      const { data: lessonData, error: lessonError } = await supabase
        .from('interactive_lesson_analytics')
        .select('user_id, time_spent_seconds, started_at')
        .eq('course_id', courseId);

      if (lessonError) {
        console.warn('Failed to load lesson analytics:', lessonError);
      }

      // Calculate analytics
      const enrollments = enrollmentData || [];
      const lessons = lessonData || [];

      const totalEnrollments = enrollments.length;
      const completedEnrollments = enrollments.filter(e => (e as any).percent >= 100).length;
      const completionRate = totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0;
      
      const totalTimeSpent = lessons.reduce((sum, lesson) => sum + (lesson.time_spent_seconds || 0), 0);
      const averageTimeSpent = totalEnrollments > 0 ? totalTimeSpent / totalEnrollments / 60 : 0; // in minutes

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const lastWeekActivity = lessons.filter(
        lesson => lesson.started_at && new Date(lesson.started_at) > oneWeekAgo
      ).length;

      setAnalytics({
        totalEnrollments,
        completionRate,
        averageTimeSpent,
        lastWeekActivity,
      });

    } catch (err) {
      console.error('Error loading course analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load course analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading course analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !course || !analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Analytics Not Available</h1>
          <p className="text-muted-foreground mb-6">
            {error || 'Unable to load analytics for this course.'}
          </p>
          <Button onClick={() => navigate(`/org/${orgId}/courses`)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(`/org/${orgId}/courses`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Courses
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{course.title}</h1>
                <p className="text-muted-foreground">Course Analytics</p>
              </div>
            </div>
            <Badge variant="secondary">
              <BarChart3 className="w-4 h-4 mr-1" />
              Analytics
            </Badge>
          </div>
        </div>
      </div>

      {/* Analytics Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Enrollments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalEnrollments}</div>
              <p className="text-xs text-muted-foreground">
                Students enrolled in this course
              </p>
            </CardContent>
          </Card>

          {/* Completion Rate */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.completionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Students who completed the course
              </p>
            </CardContent>
          </Card>

          {/* Average Time Spent */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Time Spent</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(analytics.averageTimeSpent)}m</div>
              <p className="text-xs text-muted-foreground">
                Average time per student
              </p>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.lastWeekActivity}</div>
              <p className="text-xs text-muted-foreground">
                Sessions in the last 7 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Course Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Title</h3>
                <p className="text-muted-foreground">{course.title}</p>
              </div>
              
              {course.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{course.description}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                {course.instructor_name && (
                  <div>
                    <h4 className="font-medium text-sm">Instructor</h4>
                    <p className="text-sm text-muted-foreground">{course.instructor_name}</p>
                  </div>
                )}
                
                {course.duration_minutes && (
                  <div>
                    <h4 className="font-medium text-sm">Duration</h4>
                    <p className="text-sm text-muted-foreground">{course.duration_minutes} minutes</p>
                  </div>
                )}
                
                {course.difficulty_level && (
                  <div>
                    <h4 className="font-medium text-sm">Difficulty</h4>
                    <Badge variant="outline" className="capitalize">
                      {course.difficulty_level}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Enrollment Status</span>
                  <span className="font-medium">
                    {analytics.totalEnrollments > 0 ? 'Active' : 'No Enrollments'}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Completion Performance</span>
                  <span className="font-medium">
                    {analytics.completionRate >= 70 ? 'Good' : 
                     analytics.completionRate >= 40 ? 'Average' : 'Needs Attention'}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Recent Engagement</span>
                  <span className="font-medium">
                    {analytics.lastWeekActivity > 0 ? 'Active' : 'Low Activity'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Analytics data is updated in real-time based on student interactions 
                  and course completions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}