import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  BookOpen,
  Target,
  Trophy,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  PauseCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StudentProgressData {
  user_id: string;
  profile: {
    full_name: string;
    display_name?: string;
    avatar_url?: string;
  };
  overall_progress: number;
  courses: Array<{
    id: string;
    title: string;
    progress: number;
    status: 'active' | 'completed' | 'paused';
    last_activity: string;
  }>;
  goals: Array<{
    id: string;
    title: string;
    progress: number;
    target_date: string;
    status: 'active' | 'completed' | 'paused';
  }>;
  achievements: Array<{
    id: string;
    name: string;
    unlocked_at: string;
    xp_reward: number;
  }>;
  stats: {
    total_xp: number;
    level: number;
    study_time_hours: number;
    courses_completed: number;
    goals_completed: number;
  };
}

export default function StudentProgress() {
  const { studentId, orgId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: studentData, isLoading } = useQuery({
    queryKey: ['student-progress', studentId, orgId],
    queryFn: async () => {
      if (!studentId) throw new Error('Student ID required');

      // For now, return mock data until we have the full progress system
      // In the future, this would query actual progress data from multiple tables
      return {
        user_id: studentId,
        profile: {
          full_name: 'Student User',
          display_name: 'Student',
          avatar_url: undefined
        },
        overall_progress: 67,
        courses: [
          {
            id: '1',
            title: 'Introduction to Programming',
            progress: 85,
            status: 'active' as const,
            last_activity: '2025-09-08'
          },
          {
            id: '2', 
            title: 'Data Structures',
            progress: 45,
            status: 'active' as const,
            last_activity: '2025-09-07'
          },
          {
            id: '3',
            title: 'Web Development Basics',
            progress: 100,
            status: 'completed' as const,
            last_activity: '2025-09-05'
          }
        ],
        goals: [
          {
            id: '1',
            title: 'Complete Programming Fundamentals',
            progress: 75,
            target_date: '2025-12-31',
            status: 'active' as const
          },
          {
            id: '2',
            title: 'Build First Web Application',
            progress: 30,
            target_date: '2025-11-30',
            status: 'active' as const
          }
        ],
        achievements: [
          {
            id: '1',
            name: 'First Course Completed',
            unlocked_at: '2025-09-05',
            xp_reward: 100
          },
          {
            id: '2',
            name: 'Study Streak - 7 Days',
            unlocked_at: '2025-09-01',
            xp_reward: 50
          }
        ],
        stats: {
          total_xp: 1250,
          level: 5,
          study_time_hours: 24,
          courses_completed: 1,
          goals_completed: 0
        }
      } as StudentProgressData;
    },
    enabled: !!studentId
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">Loading student progress...</div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">Student Not Found</h2>
          <p className="text-muted-foreground">Unable to load student progress data.</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'active': return 'secondary';
      case 'paused': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'paused': return <PauseCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={studentData.profile.avatar_url} />
              <AvatarFallback className="text-lg">
                {studentData.profile.full_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{studentData.profile.full_name}</h1>
              <p className="text-muted-foreground">Student Progress Overview</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{studentData.overall_progress}%</div>
              <Progress value={studentData.overall_progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">XP & Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <div className="text-2xl font-bold">Lv.{studentData.stats.level}</div>
            </div>
            <p className="text-xs text-muted-foreground">{studentData.stats.total_xp} XP earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <div className="text-2xl font-bold">{studentData.stats.study_time_hours}h</div>
            </div>
            <p className="text-xs text-muted-foreground">Total study time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <div className="text-2xl font-bold">{studentData.stats.courses_completed}</div>
            </div>
            <p className="text-xs text-muted-foreground">Courses completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Progress Tabs */}
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Progress
              </CardTitle>
              <CardDescription>
                Track progress across all enrolled courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentData.courses.map((course) => (
                  <div key={course.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{course.title}</h3>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(course.status)}
                        <Badge variant={getStatusColor(course.status)}>
                          {course.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Last activity: {new Date(course.last_activity).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Learning Goals
              </CardTitle>
              <CardDescription>
                Monitor progress toward learning objectives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentData.goals.map((goal) => (
                  <div key={goal.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{goal.title}</h3>
                      <Badge variant={getStatusColor(goal.status)}>
                        {goal.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Target: {new Date(goal.target_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Achievements
              </CardTitle>
              <CardDescription>
                Badges and milestones earned by the student
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studentData.achievements.map((achievement) => (
                  <div key={achievement.id} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{achievement.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(achievement.unlocked_at).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant="secondary">+{achievement.xp_reward} XP</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}