import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { getActiveOrgId } from '@/lib/org/context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, BookOpen, Clock, TrendingUp, Users } from 'lucide-react';

interface AnalyticsStats {
  totalEnrollments: number;
  totalSessions: number;
  totalLessonsCompleted: number;
  totalTimeSpent: number;
  todayTimeSpent: number;
  averageEngagement: number;
  organizationContext: string | null;
}

export default function AnalyticsDebug() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AnalyticsStats>({
    totalEnrollments: 0,
    totalSessions: 0,
    totalLessonsCompleted: 0,
    totalTimeSpent: 0,
    todayTimeSpent: 0,
    averageEngagement: 0,
    organizationContext: null
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    const loadAnalytics = async () => {
      try {
        const orgId = getActiveOrgId();

        // Fetch enrollments
        const { data: enrollments } = await supabase
          .from('interactive_course_enrollments')
          .select('*')
          .eq('user_id', user.id);

        // Fetch sessions
        const { data: sessions } = await supabase
          .from('interactive_course_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('session_start', { ascending: false })
          .limit(10);

        // Fetch lesson analytics
        const { data: lessons } = await supabase
          .from('interactive_lesson_analytics')
          .select('*')
          .eq('user_id', user.id)
          .not('completed_at', 'is', null);

        // Calculate today's time spent
        const today = new Date().toISOString().split('T')[0];
        const { data: todaySessions } = await supabase
          .from('interactive_course_sessions')
          .select('duration_seconds')
          .eq('user_id', user.id)
          .gte('session_start', today);

        const todayTime = todaySessions?.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) || 0;

        // Calculate average engagement
        const avgEngagement = lessons?.length
          ? lessons.reduce((sum, l) => sum + (l.engagement_score || 0), 0) / lessons.length
          : 0;

        setStats({
          totalEnrollments: enrollments?.length || 0,
          totalSessions: sessions?.length || 0,
          totalLessonsCompleted: lessons?.length || 0,
          totalTimeSpent: enrollments?.reduce((sum, e) => sum + (e.total_time_spent_minutes || 0), 0) || 0,
          todayTimeSpent: Math.round(todayTime / 60),
          averageEngagement: Math.round(avgEngagement),
          organizationContext: orgId
        });

        setRecentActivity(sessions?.slice(0, 5) || []);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();

    // Refresh every 30 seconds
    const interval = setInterval(loadAnalytics, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Debug Dashboard</h1>
          <p className="text-muted-foreground">Real-time tracking verification for your learning activity</p>
        </div>
        {stats.organizationContext && (
          <Badge variant="outline" className="text-sm">
            <Users className="h-4 w-4 mr-2" />
            Organization Mode
          </Badge>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrollments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">Active courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">Learning sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayTimeSpent}</div>
            <p className="text-xs text-muted-foreground">minutes spent today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageEngagement}%</div>
            <p className="text-xs text-muted-foreground">average engagement</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
            <CardDescription>Your overall learning statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Lessons Completed</span>
              <span className="font-semibold">{stats.totalLessonsCompleted}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Time Spent</span>
              <span className="font-semibold">{stats.totalTimeSpent} minutes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Engagement</span>
              <span className="font-semibold">{stats.averageEngagement}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Organization Context</span>
              <span className="font-semibold">
                {stats.organizationContext ? 'Active' : 'Personal'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest learning sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No recent activity found
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((session, index) => (
                  <div key={index} className="flex justify-between items-center text-sm border-b pb-2">
                    <div>
                      <p className="font-medium">{session.course_id}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.session_type} session
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {Math.round((session.duration_seconds || 0) / 60)}m
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.session_start).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">How Analytics Tracking Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>✅ <strong>Enrollments:</strong> Tracked when you start a new course</p>
          <p>✅ <strong>Sessions:</strong> Recorded each time you access course content</p>
          <p>✅ <strong>Lessons:</strong> Completion and engagement tracked per lesson</p>
          <p>✅ <strong>Time Tracking:</strong> Automatic session duration tracking</p>
          <p>✅ <strong>Organization Context:</strong> All analytics include your organization when in org mode</p>
          <p className="mt-4 text-muted-foreground">
            <strong>Note:</strong> This data is visible to your organization administrators and contributes to organizational analytics dashboards.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
