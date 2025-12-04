import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, BookOpen, TrendingUp, Clock, Building2, Activity, BarChart3, MessageCircle, Target } from 'lucide-react';
import ErrorBoundaryUnified from '@/components/ErrorBoundaryUnified';
import { useAnalyticsDashboard } from '@/hooks/useAnalyticsDashboard';

// Dynamic imports for admin analytics components
const CoursePerformanceAnalytics = React.lazy(() => 
  import('@/components/analytics/CoursePerformanceAnalytics')
);

const AdminReadingAnalytics = React.lazy(() => 
  import('@/components/analytics/AdminReadingAnalytics')
);

const AdminAICoachAnalytics = React.lazy(() => 
  import('@/components/analytics/AdminAICoachAnalytics')
);

const AdminGoalsAnalytics = React.lazy(() => 
  import('@/components/analytics/AdminGoalsAnalytics')
);

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    kpis,
    dailyActiveUsers,
    timeSpentByDay,
    courseEnrollments,
    completionBreakdown,
    orgLeaderboard,
    isLoading
  } = useAnalyticsDashboard();

  // Transform daily active users for chart
  const dailyActiveUsersChart = dailyActiveUsers.map(item => ({
    date: new Date(item.activity_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    users: Number(item.active_users)
  }));

  // Transform time spent data for chart
  const timeSpentChart = timeSpentByDay.map(item => ({
    day: item.day_name,
    hours: Number(item.total_hours).toFixed(1)
  }));

  // Transform course enrollments for horizontal bar chart
  const courseEnrollmentsChart = courseEnrollments.map(item => ({
    title: item.course_title.length > 30 ? item.course_title.substring(0, 30) + '...' : item.course_title,
    enrollments: Number(item.enrollment_count),
    completionRate: Number(item.completion_rate)
  }));

  // Transform completion breakdown for doughnut chart
  const completionChart = completionBreakdown.map(item => ({
    name: item.status,
    value: Number(item.count),
    percentage: Number(item.percentage)
  }));

  const COMPLETION_COLORS = {
    'Not Started': '#94a3b8',
    'In Progress': '#3b82f6',
    'Completed': '#10b981'
  };

  const statCards = [
    {
      title: 'Total Users',
      value: kpis.totalUsers,
      change: 'Active platform users',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Weekly Active Users',
      value: kpis.weeklyActiveUsers,
      change: 'Last 7 days',
      icon: Activity,
      color: 'text-green-600',
    },
    {
      title: 'Total Enrollments',
      value: kpis.totalEnrollments,
      change: 'All courses',
      icon: BookOpen,
      color: 'text-purple-600',
    },
    {
      title: 'Avg Course Progress',
      value: `${kpis.avgCourseProgress}%`,
      change: 'Completion rate',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
    {
      title: 'Time Spent (Week)',
      value: `${kpis.totalTimeWeek.toFixed(1)}h`,
      change: 'Learning hours',
      icon: Clock,
      color: 'text-pink-600',
    },
    {
      title: 'Organizations',
      value: kpis.totalOrganizations,
      change: 'Total active',
      icon: Building2,
      color: 'text-indigo-600',
    },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Track platform performance and user engagement across all users
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Courses</span>
          </TabsTrigger>
          <TabsTrigger value="reading" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Reading</span>
          </TabsTrigger>
          <TabsTrigger value="ai-coach" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">AI Coach</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Goals</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <ErrorBoundaryUnified>
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {statCards.map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        <>
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <p className="text-xs text-muted-foreground">{stat.change}</p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Active Users */}
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Active Users (Last 30 Days)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-[300px] w-full" />
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dailyActiveUsersChart}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="users" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            name="Active Users"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                {/* Time Spent by Day */}
                <Card>
                  <CardHeader>
                    <CardTitle>Time Spent by Day (Last 7 Days)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-[300px] w-full" />
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={timeSpentChart}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                          <Tooltip />
                          <Bar dataKey="hours" fill="#10b981" name="Hours" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                {/* Top 10 Most Enrolled Courses */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top 10 Most Enrolled Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-[300px] w-full" />
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={courseEnrollmentsChart} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis 
                            dataKey="title" 
                            type="category" 
                            width={150}
                            tick={{ fontSize: 11 }}
                          />
                          <Tooltip />
                          <Bar dataKey="enrollments" fill="#8b5cf6" name="Enrollments" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                {/* Overall Course Completion */}
                <Card>
                  <CardHeader>
                    <CardTitle>Overall Course Completion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-[300px] w-full" />
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={completionChart}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percentage }) => `${name}: ${percentage}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {completionChart.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COMPLETION_COLORS[entry.name]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Organization Leaderboard Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Organization Leaderboard</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Organization Name</TableHead>
                          <TableHead className="text-right">Members</TableHead>
                          <TableHead className="text-right">Enrollments</TableHead>
                          <TableHead className="text-right">Avg Progress</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orgLeaderboard.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                              No organization data available
                            </TableCell>
                          </TableRow>
                        ) : (
                          orgLeaderboard.map((org) => (
                            <TableRow key={org.org_id}>
                              <TableCell className="font-medium">{org.org_name}</TableCell>
                              <TableCell className="text-right">{org.member_count}</TableCell>
                              <TableCell className="text-right">{org.total_enrollments}</TableCell>
                              <TableCell className="text-right">{org.avg_progress}%</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </ErrorBoundaryUnified>
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          <ErrorBoundaryUnified>
            <React.Suspense fallback={
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            }>
              <CoursePerformanceAnalytics />
            </React.Suspense>
          </ErrorBoundaryUnified>
        </TabsContent>

        <TabsContent value="reading" className="mt-6">
          <ErrorBoundaryUnified>
            <React.Suspense fallback={
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            }>
              <AdminReadingAnalytics />
            </React.Suspense>
          </ErrorBoundaryUnified>
        </TabsContent>

        <TabsContent value="ai-coach" className="mt-6">
          <ErrorBoundaryUnified>
            <React.Suspense fallback={
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            }>
              <AdminAICoachAnalytics />
            </React.Suspense>
          </ErrorBoundaryUnified>
        </TabsContent>

        <TabsContent value="goals" className="mt-6">
          <ErrorBoundaryUnified>
            <React.Suspense fallback={
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            }>
              <AdminGoalsAnalytics />
            </React.Suspense>
          </ErrorBoundaryUnified>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
