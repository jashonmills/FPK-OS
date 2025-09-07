import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Flag, Plus, Search, Filter, Target, TrendingUp } from 'lucide-react';
import { useOrgContext } from '@/components/organizations/OrgContext';

export default function GoalsManagement() {
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

  // Mock goals data for demonstration
  const mockGoals = [
    {
      id: '1',
      title: 'Improve Organization-wide Learning Completion Rate',
      description: 'Increase course completion rate to 90% across all students',
      targetValue: 90,
      currentValue: 78,
      category: 'learning',
      priority: 'high',
      dueDate: '2024-03-31',
      assignedStudents: 15,
      status: 'active'
    },
    {
      id: '2',
      title: 'Enhance Student Engagement Metrics',
      description: 'Achieve 95% weekly active student participation',
      targetValue: 95,
      currentValue: 82,
      category: 'engagement',
      priority: 'medium',
      dueDate: '2024-02-29',
      assignedStudents: 12,
      status: 'active'
    },
    {
      id: '3',
      title: 'Reduce Course Dropout Rate',
      description: 'Maintain course dropout rate below 10%',
      targetValue: 10,
      currentValue: 8,
      category: 'retention',
      priority: 'high',
      dueDate: '2024-06-30',
      assignedStudents: 20,
      status: 'achieved'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning': return 'default';
      case 'engagement': return 'secondary';
      case 'retention': return 'outline';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
          <p className="text-muted-foreground mt-2">
            Set and track organizational learning goals for your students
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Goal
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Goals</span>
            </div>
            <div className="text-2xl font-bold mt-2">3</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Active Goals</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-blue-600">2</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Achieved</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-green-600">1</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Avg Progress</span>
            </div>
            <div className="text-2xl font-bold mt-2">83%</div>
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
                placeholder="Search goals..." 
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

      {/* Goals List */}
      <div className="space-y-4">
        {mockGoals.map((goal) => {
          const progressPercentage = goal.category === 'retention' 
            ? Math.max(0, 100 - (goal.currentValue / goal.targetValue * 100))
            : (goal.currentValue / goal.targetValue) * 100;
          
          return (
            <Card key={goal.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <CardDescription>{goal.description}</CardDescription>
                    <div className="flex gap-2">
                      <Badge variant={getCategoryColor(goal.category) as any}>
                        {goal.category}
                      </Badge>
                      <Badge variant={getPriorityColor(goal.priority) as any}>
                        {goal.priority} priority
                      </Badge>
                      <Badge variant={goal.status === 'achieved' ? 'default' : 'secondary'}>
                        {goal.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm font-medium">Target</div>
                    <div className="text-lg font-bold">
                      {goal.targetValue}{goal.category === 'retention' ? '% max' : '%'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Current</div>
                    <div className="text-lg font-bold">
                      {goal.currentValue}{goal.category === 'retention' ? '% current' : '%'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Progress</div>
                    <div className="text-lg font-bold mb-1">
                      {Math.round(progressPercentage)}%
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          progressPercentage >= 100 ? 'bg-green-500' : 
                          progressPercentage >= 75 ? 'bg-blue-500' : 
                          progressPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, progressPercentage)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button size="sm">
                      Edit Goal
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Due: {new Date(goal.dueDate).toLocaleDateString()} • 
                    Assigned to {goal.assignedStudents} students
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}