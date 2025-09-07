import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, BookOpen, Clock, Target } from 'lucide-react';
import { useOrgContext } from '@/components/organizations/OrgContext';

export default function AnalyticsOverview() {
  const { currentOrg } = useOrgContext();

  if (!currentOrg) {
    return (
      <div className="container max-w-6xl mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No organization selected</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock analytics data for demonstration
  const analyticsData = {
    totalStudents: 12,
    activeStudents: 10,
    totalCourses: 3,
    completionRate: 78,
    avgSessionTime: 32,
    weeklyEngagement: 85,
    monthlyProgress: [65, 72, 78, 85, 82, 78],
    topCourses: [
      { title: 'Introduction to Learning State', enrollments: 12, completion: 85 },
      { title: 'Emotional Intelligence Basics', enrollments: 8, completion: 70 },
      { title: 'Advanced Study Techniques', enrollments: 0, completion: 0 }
    ]
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Monitor your organization's learning performance and engagement
          </p>
        </div>
        <Button variant="outline">
          <BarChart3 className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{analyticsData.totalStudents}</p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active This Week</p>
                <p className="text-2xl font-bold">{analyticsData.activeStudents}</p>
                <p className="text-xs text-green-600">
                  +12% from last week
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{analyticsData.completionRate}%</p>
                <p className="text-xs text-blue-600">
                  +5% from last month
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Session Time</p>
                <p className="text-2xl font-bold">{analyticsData.avgSessionTime}m</p>
                <p className="text-xs text-purple-600">
                  +3m from last week
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Progress Trend</CardTitle>
            <CardDescription>
              Average completion percentage over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-48 bg-muted/20 rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Progress Chart Placeholder</p>
                  <p className="text-xs">Monthly trend: {analyticsData.monthlyProgress.join('% → ')}%</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">This Month</div>
                  <div className="text-xl font-bold">{analyticsData.monthlyProgress[analyticsData.monthlyProgress.length - 1]}%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Last Month</div>
                  <div className="text-xl font-bold">{analyticsData.monthlyProgress[analyticsData.monthlyProgress.length - 2]}%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Avg Growth</div>
                  <div className="text-xl font-bold text-green-600">+3.2%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Student Engagement</CardTitle>
            <CardDescription>
              Weekly engagement metrics and activity levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Weekly Engagement</span>
                  <Badge variant="default">{analyticsData.weeklyEngagement}%</Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${analyticsData.weeklyEngagement}%` }}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Course Completion</span>
                  <Badge variant="secondary">{analyticsData.completionRate}%</Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${analyticsData.completionRate}%` }}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Assignment Submission</span>
                  <Badge variant="outline">74%</Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: '74%' }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Course Performance
          </CardTitle>
          <CardDescription>
            Enrollment and completion metrics for each course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.topCourses.map((course, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{course.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{course.enrollments} enrollments</span>
                    <span>{course.completion}% completion rate</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{course.completion}%</div>
                    <div className="w-24 bg-muted rounded-full h-2 mt-1">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${course.completion}%` }}
                      />
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Actions</CardTitle>
          <CardDescription>
            Common analytics tasks and reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <BarChart3 className="w-5 h-5 mb-2" />
              <div className="text-left">
                <div className="font-medium">Generate Report</div>
                <div className="text-xs text-muted-foreground">Export detailed analytics</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <TrendingUp className="w-5 h-5 mb-2" />
              <div className="text-left">
                <div className="font-medium">Performance Insights</div>
                <div className="text-xs text-muted-foreground">AI-powered recommendations</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <Users className="w-5 h-5 mb-2" />
              <div className="text-left">
                <div className="font-medium">Student Analytics</div>
                <div className="text-xs text-muted-foreground">Individual progress tracking</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}