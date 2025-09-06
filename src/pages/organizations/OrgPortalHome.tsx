import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Calendar,
  Award
} from 'lucide-react';
import { useOrgContext } from '@/components/organizations/OrgContext';

export default function OrgPortalHome() {
  const { currentOrg } = useOrgContext();

  if (!currentOrg) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Organizations</CardTitle>
            <CardDescription>
              Join or create an organization to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button>Create Organization</Button>
              <Button variant="outline">Join with Code</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock data for demonstration
  const stats = [
    { label: 'Active Students', value: '24', icon: Users, color: 'text-blue-600' },
    { label: 'Courses Assigned', value: '8', icon: BookOpen, color: 'text-green-600' },
    { label: 'Goals Created', value: '15', icon: Target, color: 'text-purple-600' },
    { label: 'Completion Rate', value: '87%', icon: TrendingUp, color: 'text-orange-600' },
  ];

  const recentActivity = [
    { type: 'goal', message: 'New goal created for Math fundamentals', time: '2 hours ago' },
    { type: 'course', message: 'Physics course assigned to 5 students', time: '4 hours ago' },
    { type: 'member', message: 'Sarah Johnson joined the organization', time: '1 day ago' },
    { type: 'achievement', message: '3 students completed Chemistry basics', time: '2 days ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening in {currentOrg.organizations.name}
          </p>
        </div>
        <Badge variant="secondary" className="capitalize">
          {currentOrg.organizations.subscription_tier} Plan
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Progress Overview</span>
            </CardTitle>
            <CardDescription>
              Current completion rates across all courses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Mathematics</span>
                <span>85%</span>
              </div>
              <Progress value={85} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Science</span>
                <span>72%</span>
              </div>
              <Progress value={72} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Language Arts</span>
                <span>91%</span>
              </div>
              <Progress value={91} />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>
              Latest updates from your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.message}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks for organization management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Invite Members</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Assign Course</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Create Goal</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span>View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}