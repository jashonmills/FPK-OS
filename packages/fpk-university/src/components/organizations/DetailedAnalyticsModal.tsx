import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Clock, 
  TrendingUp, 
  Award, 
  Target, 
  BookOpen,
  Activity,
  Zap,
  Calendar
} from 'lucide-react';

interface DetailedAnalyticsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
}

interface CourseAnalytics {
  course_id: string;
  course_title: string;
  completion_percentage: number;
  total_time_spent_minutes: number;
  last_accessed_at: string;
  completed_at: string | null;
  engagement_score?: number;
  lessons_completed?: number;
  total_lessons?: number;
}

export function DetailedAnalyticsModal({ open, onOpenChange, organizationId }: DetailedAnalyticsModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [courseAnalytics, setCourseAnalytics] = useState<CourseAnalytics[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [studyStreak, setStudyStreak] = useState(0);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [avgEngagement, setAvgEngagement] = useState(0);

  useEffect(() => {
    if (open && user?.id && organizationId) {
      fetchDetailedAnalytics();
    }
  }, [open, user?.id, organizationId]);

  const fetchDetailedAnalytics = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Fetch course enrollments with analytics
      const { data: enrollments } = await supabase
        .from('interactive_course_enrollments')
        .select('*')
        .eq('user_id', user.id)
        .eq('org_id', organizationId)
        .order('last_accessed_at', { ascending: false });

      // Fetch lesson analytics for engagement scores
      const { data: lessonAnalytics } = await supabase
        .from('interactive_lesson_analytics')
        .select('course_id, engagement_score, lesson_id')
        .eq('user_id', user.id)
        .eq('org_id', organizationId);

      // Calculate engagement per course
      const courseEngagement = lessonAnalytics?.reduce((acc: Record<string, { total: number; count: number }>, lesson) => {
        if (!acc[lesson.course_id]) {
          acc[lesson.course_id] = { total: 0, count: 0 };
        }
        acc[lesson.course_id].total += lesson.engagement_score || 0;
        acc[lesson.course_id].count += 1;
        return acc;
      }, {});

      // Count lessons per course
      const courseLessonCount = lessonAnalytics?.reduce((acc: Record<string, Set<number>>, lesson) => {
        if (!acc[lesson.course_id]) {
          acc[lesson.course_id] = new Set();
        }
        acc[lesson.course_id].add(lesson.lesson_id);
        return acc;
      }, {});

      // Combine data
      const enrichedCourses: CourseAnalytics[] = (enrollments || []).map(enrollment => ({
        ...enrollment,
        engagement_score: courseEngagement?.[enrollment.course_id] 
          ? Math.round(courseEngagement[enrollment.course_id].total / courseEngagement[enrollment.course_id].count)
          : 0,
        lessons_completed: courseLessonCount?.[enrollment.course_id]?.size || 0,
        total_lessons: 10 // TODO: Get from course metadata
      }));

      setCourseAnalytics(enrichedCourses);

      // Calculate totals (convert minutes to seconds for formatTime)
      const totalTime = enrichedCourses.reduce((sum, c) => sum + ((c.total_time_spent_minutes || 0) * 60), 0);
      setTotalStudyTime(totalTime);

      const avgEng = enrichedCourses.length > 0
        ? Math.round(enrichedCourses.reduce((sum, c) => sum + (c.engagement_score || 0), 0) / enrichedCourses.length)
        : 0;
      setAvgEngagement(avgEng);

      // Fetch XP
      const { data: xpData } = await supabase
        .from('user_xp')
        .select('total_xp')
        .eq('user_id', user.id)
        .single();
      
      setTotalXP(xpData?.total_xp || 0);

      // Calculate study streak from daily activities
      const { data: activities } = await supabase
        .from('daily_activities')
        .select('activity_date')
        .eq('user_id', user.id)
        .order('activity_date', { ascending: false })
        .limit(30);

      if (activities && activities.length > 0) {
        let streak = 0;
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        // Check if there's activity today or yesterday
        if (activities[0].activity_date === today || activities[0].activity_date === yesterday) {
          streak = 1;
          let currentDate = activities[0].activity_date;
          
          for (let i = 1; i < activities.length; i++) {
            const prevDate = new Date(currentDate);
            prevDate.setDate(prevDate.getDate() - 1);
            const expectedDate = prevDate.toISOString().split('T')[0];
            
            if (activities[i].activity_date === expectedDate) {
              streak++;
              currentDate = activities[i].activity_date;
            } else {
              break;
            }
          }
        }
        setStudyStreak(streak);
      }

    } catch (error) {
      console.error('Error fetching detailed analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Detailed Learning Analytics
          </DialogTitle>
          <DialogDescription>
            Comprehensive view of your learning progress and engagement
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Total Time</span>
                </div>
                <div className="text-2xl font-bold">{formatTime(totalStudyTime)}</div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Engagement</span>
                </div>
                <div className="text-2xl font-bold">{avgEngagement}%</div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Total XP</span>
                </div>
                <div className="text-2xl font-bold">{totalXP}</div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Study Streak</span>
                </div>
                <div className="text-2xl font-bold">{studyStreak} days</div>
              </Card>
            </div>

            {/* Course Progress Details */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Course Progress
              </h3>

              {courseAnalytics.length > 0 ? (
                <div className="space-y-3">
                  {courseAnalytics.map((course) => (
                    <Card key={course.course_id} className="p-4">
                      <div className="space-y-3">
                        {/* Course Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{course.course_title}</h4>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime((course.total_time_spent_minutes || 0) * 60)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Target className="h-3 w-3" />
                                {course.lessons_completed}/{course.total_lessons} lessons
                              </span>
                              <span className="flex items-center gap-1">
                                <Zap className="h-3 w-3" />
                                {course.engagement_score}% engaged
                              </span>
                            </div>
                          </div>
                          <Badge variant={course.completed_at ? "default" : "secondary"}>
                            {course.completed_at ? 'Completed' : 'In Progress'}
                          </Badge>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{Math.round(course.completion_percentage || 0)}%</span>
                          </div>
                          <Progress value={course.completion_percentage || 0} className="h-2" />
                        </div>

                        {/* Last Accessed */}
                        {course.last_accessed_at && (
                          <div className="text-xs text-muted-foreground">
                            Last accessed: {new Date(course.last_accessed_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No course analytics available yet</p>
                  <p className="text-sm text-muted-foreground mt-2">Start learning to see your progress here</p>
                </Card>
              )}
            </div>

            {/* Learning Patterns */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Learning Insights
              </h3>
              
              <Card className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Average Session Length</span>
                    <div className="font-medium mt-1">
                      {courseAnalytics.length > 0 
                        ? formatTime(Math.round(totalStudyTime / courseAnalytics.length))
                        : '0m'}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Courses Completed</span>
                    <div className="font-medium mt-1">
                      {courseAnalytics.filter(c => c.completed_at).length} / {courseAnalytics.length}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Average Engagement</span>
                    <div className="font-medium mt-1">{avgEngagement}%</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Active Courses</span>
                    <div className="font-medium mt-1">
                      {courseAnalytics.filter(c => !c.completed_at).length}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
