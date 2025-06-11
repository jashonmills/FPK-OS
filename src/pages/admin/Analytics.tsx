
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, BookOpen, TrendingUp, Award, Clock, Target } from 'lucide-react';

interface UserStats {
  totalUsers: number;
  newUsersThisWeek: number;
  roleDistribution: Record<string, number>;
  activeUsers: number;
  retentionRate: number;
}

interface CourseStats {
  totalCourses: number;
  publishedCourses: number;
  totalEnrollments: number;
  avgEnrollmentsPerCourse: number;
  completionRate: number;
}

interface StudyStats {
  totalSessions: number;
  avgSessionDuration: number;
  accuracyRate: number;
  studyStreak: number;
}

const Analytics = () => {
  // User statistics
  const { data: userStats = {
    totalUsers: 0,
    newUsersThisWeek: 0,
    roleDistribution: {},
    activeUsers: 0,
    retentionRate: 0
  } as UserStats } = useQuery({
    queryKey: ['admin-user-stats'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, created_at');

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role');

      if (profilesError || rolesError) throw new Error('Failed to fetch user stats');

      const totalUsers = profiles?.length || 0;
      const newUsersThisWeek = profiles?.filter(p => 
        new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length || 0;

      const roleDistribution = roles?.reduce((acc: Record<string, number>, r) => {
        acc[r.role] = (acc[r.role] || 0) + 1;
        return acc;
      }, {}) || {};

      return {
        totalUsers,
        newUsersThisWeek,
        roleDistribution,
        activeUsers: Math.floor(totalUsers * 0.75), // Mock active users
        retentionRate: 85, // Mock retention rate
      } as UserStats;
    },
  });

  // Course statistics
  const { data: courseStats = {
    totalCourses: 0,
    publishedCourses: 0,
    totalEnrollments: 0,
    avgEnrollmentsPerCourse: 0,
    completionRate: 0
  } as CourseStats } = useQuery({
    queryKey: ['admin-course-stats'],
    queryFn: async () => {
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('id, status, created_at');

      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('course_id, enrolled_at');

      if (coursesError || enrollmentsError) throw new Error('Failed to fetch course stats');

      const totalCourses = courses?.length || 0;
      const publishedCourses = courses?.filter(c => c.status === 'published').length || 0;
      const totalEnrollments = enrollments?.length || 0;
      const avgEnrollmentsPerCourse = totalCourses > 0 ? Math.round(totalEnrollments / totalCourses) : 0;

      return {
        totalCourses,
        publishedCourses,
        totalEnrollments,
        avgEnrollmentsPerCourse,
        completionRate: 68, // Mock completion rate
      } as CourseStats;
    },
  });

  // Study sessions data
  const { data: studyStats = {
    totalSessions: 0,
    avgSessionDuration: 0,
    accuracyRate: 0,
    studyStreak: 0
  } as StudyStats } = useQuery({
    queryKey: ['admin-study-stats'],
    queryFn: async () => {
      const { data: sessions, error } = await supabase
        .from('study_sessions')
        .select('created_at, session_duration_seconds, correct_answers, total_cards');

      if (error) throw new Error('Failed to fetch study stats');

      const totalSessions = sessions?.length || 0;
      const avgSessionDuration = sessions?.reduce((acc, s) => acc + (s.session_duration_seconds || 0), 0) / totalSessions || 0;
      const totalCorrectAnswers = sessions?.reduce((acc, s) => acc + (s.correct_answers || 0), 0) || 0;
      const totalQuestions = sessions?.reduce((acc, s) => acc + (s.total_cards || 0), 0) || 0;
      const accuracyRate = totalQuestions > 0 ? Math.round((totalCorrectAnswers / totalQuestions) * 100) : 0;

      return {
        totalSessions,
        avgSessionDuration: Math.round(avgSessionDuration / 60), // Convert to minutes
        accuracyRate,
        studyStreak: 12, // Mock study streak
      } as StudyStats;
    },
  });

  // Mock data for charts
  const weeklyActivityData = [
    { name: 'Mon', users: 45, sessions: 120 },
    { name: 'Tue', users: 52, sessions: 140 },
    { name: 'Wed', users: 48, sessions: 110 },
    { name: 'Thu', users: 61, sessions: 180 },
    { name: 'Fri', users: 55, sessions: 160 },
    { name: 'Sat', users: 40, sessions: 95 },
    { name: 'Sun', users: 35, sessions: 80 },
  ];

  const enrollmentTrendsData = [
    { month: 'Jan', enrollments: 120 },
    { month: 'Feb', enrollments: 150 },
    { month: 'Mar', enrollments: 180 },
    { month: 'Apr', enrollments: 220 },
    { month: 'May', enrollments: 280 },
    { month: 'Jun', enrollments: 350 },
  ];

  const roleDistributionData = Object.entries(userStats.roleDistribution).map(([role, count]) => ({
    name: role,
    value: count,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const statCards = [
    {
      title: 'Total Users',
      value: userStats.totalUsers,
      change: `+${userStats.newUsersThisWeek} this week`,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Published Courses',
      value: courseStats.publishedCourses,
      change: `${courseStats.totalCourses} total courses`,
      icon: BookOpen,
      color: 'text-green-600',
    },
    {
      title: 'Study Sessions',
      value: studyStats.totalSessions,
      change: `${studyStats.avgSessionDuration} min avg`,
      icon: Clock,
      color: 'text-purple-600',
    },
    {
      title: 'Overall Accuracy',
      value: `${studyStats.accuracyRate}%`,
      change: `${userStats.retentionRate}% retention`,
      icon: Target,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Track platform performance and user engagement
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#8884d8" name="Active Users" />
                <Bar dataKey="sessions" fill="#82ca9d" name="Study Sessions" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Enrollment Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={enrollmentTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="enrollments" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Role Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roleDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roleDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Course Completion Rate</span>
              <Badge variant="secondary">{courseStats.completionRate}%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Avg Enrollments per Course</span>
              <Badge variant="outline">{courseStats.avgEnrollmentsPerCourse}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Users</span>
              <Badge variant="default">{userStats.activeUsers}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Average Study Streak</span>
              <Badge className="fpk-gradient text-white">{studyStats.studyStreak} days</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
