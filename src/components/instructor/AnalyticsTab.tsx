import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Target, 
  Clock,
  Award,
  Activity
} from 'lucide-react';
import { useOrgAnalytics } from '@/hooks/useOrgAnalytics';
import { useOrgStatistics } from '@/hooks/useOrgStatistics';

interface AnalyticsTabProps {
  organizationId: string;
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  student_name: string;
  activity: string;
  timestamp: string;
}

interface TopPerformer {
  id: string;
  name: string;
  student_name: string;
  score: number;
  progress: number;
  completed_goals: number;
  progress_score: number;
}

export default function AnalyticsTab({ organizationId }: AnalyticsTabProps) {
  const { analytics, isLoading: analyticsLoading } = useOrgAnalytics(organizationId);

  if (analyticsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const recentActivity = analytics?.recentActivity || [];
  const topPerformers = analytics?.topPerformers || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <p className="text-muted-foreground">Track your organization's learning progress and performance</p>
      </div>

      {/* Key metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.activeStudents || 0} active in last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.coursesCompleted || 0}</div>
            <p className="text-xs text-muted-foreground">
              Avg progress: {Math.round(analytics?.averageProgress || 0)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(analytics?.totalLearningHours || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total time spent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals Completed</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.goalsCompleted || 0}</div>
            <p className="text-xs text-muted-foreground">
              Groups: {analytics?.groupCount || 0} • Notes: {analytics?.notesCount || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity: any) => (
                  <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                    <Activity className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.event}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.length > 0 ? (
                topPerformers.map((student: any, index: number) => (
                  <div key={student.user_id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{student.full_name || 'Anonymous'}</p>
                      <p className="text-xs text-muted-foreground">
                        {student.courses_completed} courses • {Math.round(student.avg_progress)}% avg
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-medium">{Math.round(student.total_time_hours)}h</p>
                      <p className="text-xs text-muted-foreground">time</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No student data available</p>
                  <p className="text-xs text-muted-foreground mt-1">Students will appear here once they start courses</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Learning Progress Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Interactive charts will be available here showing detailed progress analytics
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}