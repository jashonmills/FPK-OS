import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, Plus, Search, Filter, Calendar, Users } from 'lucide-react';
import { useOrgContext } from '@/components/organizations/OrgContext';

export default function AssignmentsManagement() {
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

  // Mock assignment data for demonstration
  const mockAssignments = [
    {
      id: '1',
      title: 'Complete Learning State Module 1',
      description: 'Finish all lessons in the introductory module',
      dueDate: '2024-01-25',
      assignedTo: 12,
      completed: 8,
      status: 'active',
      priority: 'high',
      course: 'Introduction to Learning State'
    },
    {
      id: '2',
      title: 'Emotion Recognition Practice',
      description: 'Complete 10 emotion recognition exercises',
      dueDate: '2024-01-30',
      assignedTo: 8,
      completed: 3,
      status: 'active',
      priority: 'medium',
      course: 'Emotional Intelligence Basics'
    },
    {
      id: '3',
      title: 'Weekly Reflection Journal',
      description: 'Submit weekly reflection on learning progress',
      dueDate: '2024-01-22',
      assignedTo: 15,
      completed: 15,
      status: 'completed',
      priority: 'low',
      course: 'General Assignment'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage assignments for your students
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Assignments</span>
            </div>
            <div className="text-2xl font-bold mt-2">3</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Active</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-blue-600">2</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Completed</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-green-600">1</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Avg Completion</span>
            </div>
            <div className="text-2xl font-bold mt-2">74%</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search assignments..." 
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Assignments List */}
      <div className="space-y-4">
        {mockAssignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                  <CardDescription>{assignment.description}</CardDescription>
                  <div className="text-sm text-muted-foreground">
                    Course: {assignment.course}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant={getPriorityColor(assignment.priority) as any}>
                    {assignment.priority}
                  </Badge>
                  <Badge variant={getStatusColor(assignment.status) as any}>
                    {assignment.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Due Date</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Assigned To</div>
                    <div className="text-sm text-muted-foreground">
                      {assignment.assignedTo} students
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium">Progress</div>
                  <div className="text-sm text-muted-foreground">
                    {assignment.completed}/{assignment.assignedTo} completed
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-1">
                    <div 
                      className="bg-primary h-2 rounded-full"
                      style={{ 
                        width: `${(assignment.completed / assignment.assignedTo) * 100}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}