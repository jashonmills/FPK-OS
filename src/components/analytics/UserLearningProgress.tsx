import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target,
  Activity,
  Clock,
  TrendingUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { analyticsDataSync } from '@/utils/analyticsDataSync';

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

interface LearningTrend {
  date: string;
  completions: number;
  enrollments: number;
  averageTime: number;
}

export const UserLearningProgress: React.FC = () => {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [learningTrends, setLearningTrends] = useState<LearningTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadUserData();
  }, [user, selectedTimeRange]);

  const loadUserData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      console.log('🔄 Loading user learning progress for:', user.id);
      
      // Run analytics data sync to ensure we have the latest data
      await analyticsDataSync.runCompleteSync(user.id);
      
      // Load user progress
      const progress = await loadUserProgress();
      setUserProgress(progress);

      // Load learning trends for current user
      const trends = await loadLearningTrends(selectedTimeRange);
      setLearningTrends(trends);
      
    } catch (error) {
      console.error('Error loading user learning data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProgress = async (): Promise<UserProgress[]> => {
    // Load from new interactive course enrollments
    const { data: newData } = await supabase
      .from('interactive_course_enrollments')
      .select('*')
      .eq('user_id', user?.id);

    // Load from old enrollments table as fallback
    const { data: oldData } = await supabase
      .from('enrollments')
      .select('course_id, enrolled_at, progress')
      .eq('user_id', user?.id);

    // Convert old enrollments to new format
    const convertedOldData = (oldData || []).map(old => {
      const progress = old.progress as any;
      const completionPercentage = progress?.completion_percentage || 0;
      
      return {
        user_id: user?.id,
        course_id: old.course_id,
        course_title: getCourseTitle(old.course_id),
        enrolled_at: old.enrolled_at,
        last_accessed_at: new Date().toISOString(),
        completion_percentage: completionPercentage,
        completed_at: completionPercentage >= 100 ? new Date().toISOString() : null,
        total_time_spent_minutes: 0
      };
    });

    // Combine both data sources
    const allEnrollments = [...(newData || []), ...convertedOldData];

    return allEnrollments.map(enrollment => {
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
        courseTitle: enrollment.course_title || getCourseTitle(enrollment.course_id),
        completionPercentage: enrollment.completion_percentage,
        totalTimeSpent: enrollment.total_time_spent_minutes || 0,
        averageEngagement: 0, // Could be calculated from lesson analytics
        lastAccessed: enrollment.last_accessed_at,
        status
      };
    });
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
        <div className="grid grid-cols-1 gap-6">
          {[...Array(3)].map((_, i) => (
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

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Learning Progress</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              if (user) {
                setIsLoading(true);
                try {
                  await analyticsDataSync.runCompleteSync(user.id);
                  await loadUserData();
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

      {/* User Progress Details */}
      {userProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              My Course Progress
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
                      <p className="text-lg font-semibold">{Math.floor(progress.totalTimeSpent / 60)}h {progress.totalTimeSpent % 60}m</p>
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

      {/* Learning Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Learning Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {userProgress.length}
              </div>
              <p className="text-sm text-muted-foreground">Enrolled Courses</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {userProgress.filter(p => p.status === 'completed').length}
              </div>
              <p className="text-sm text-muted-foreground">Completed Courses</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Math.round(userProgress.reduce((sum, p) => sum + p.totalTimeSpent, 0) / 60)}h
              </div>
              <p className="text-sm text-muted-foreground">Total Study Time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My Learning Trends */}
      {learningTrends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              My Learning Trends
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

      {/* Empty State */}
      {userProgress.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Learning Progress Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start taking courses to see your learning progress and analytics here.
            </p>
            <Button>Browse Courses</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserLearningProgress;