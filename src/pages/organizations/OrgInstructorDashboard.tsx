import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  BookOpen, 
  Target, 
  FileText,
  Plus,
  TrendingUp
} from 'lucide-react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import CoursesTab from '@/components/instructor/CoursesTab';

export default function OrgInstructorDashboard() {
  const { currentOrg } = useOrgContext();

  if (!currentOrg) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Organization Required</CardTitle>
            <CardDescription>
              Please select or join an organization to access the instructor dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!['owner', 'instructor'].includes(currentOrg.role)) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need instructor or owner permissions to access this dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const quickStats = [
    { label: 'Total Students', value: '24', icon: Users },
    { label: 'Active Courses', value: '8', icon: BookOpen },
    { label: 'Goals Created', value: '15', icon: Target },
    { label: 'Notes Shared', value: '42', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage students and content for {currentOrg.organizations.name}
          </p>
        </div>
        <Badge variant="secondary" className="capitalize">
          {currentOrg.role}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% from last week
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <CoursesTab organizationId={currentOrg.organization_id} />
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Students</CardTitle>
                <CardDescription>
                  Manage students in your organization
                </CardDescription>
              </div>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Invite Student</span>
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Student management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Learning Goals</CardTitle>
                <CardDescription>
                  Create and track learning objectives
                </CardDescription>
              </div>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create Goal</span>
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Goals management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Shared Notes</CardTitle>
                <CardDescription>
                  Manage notes shared with students
                </CardDescription>
              </div>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create Note</span>
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Notes management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}