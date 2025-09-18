import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Target, Search, Plus, Calendar, User, FolderOpen } from 'lucide-react';
import { useOrgGoals } from '@/hooks/useOrgGoals';
import OrgGoalCreationDialog from '@/components/organizations/OrgGoalCreationDialog';

interface GoalsTabProps {
  organizationId: string;
}

export default function GoalsTab({ organizationId }: GoalsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('/');
  
  // Use the actual hook with organization ID
  const { goals: realGoals = [], isLoading } = useOrgGoals(organizationId);

  // Placeholder data - use real goals if available, otherwise use mock data for demonstration
  const goals = realGoals.length > 0 ? realGoals.map(goal => ({
    id: goal.id,
    title: goal.title,
    description: goal.description,
    student: 'Student', // This would come from a join with profiles
    priority: goal.priority,
    status: goal.status,
    progress: goal.progress_percentage,
    dueDate: goal.target_date,
    folder: goal.folder_path
  })) : [
    // Mock data for when no real goals exist
    {
      id: '1',
      title: 'Complete Math Module 1',
      description: 'Finish all exercises in the basic math module',
      student: 'John Doe',
      priority: 'high',
      status: 'active',
      progress: 75,
      dueDate: '2024-02-15',
      folder: '/Math'
    },
    {
      id: '2',
      title: 'Reading Comprehension Improvement',
      description: 'Improve reading speed and comprehension',
      student: 'Jane Smith',
      priority: 'medium',
      status: 'active',
      progress: 40,
      dueDate: '2024-02-20',
      folder: '/Reading'
    }
  ];

  const folders = [
    { name: 'Math', path: '/Math', count: 5 },
    { name: 'Reading', path: '/Reading', count: 3 },
    { name: 'Science', path: '/Science', count: 2 }
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
      case 'paused': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Goals Management</h2>
          <p className="text-muted-foreground">Create and track learning goals for your students</p>
        </div>
        <OrgGoalCreationDialog organizationId={organizationId}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Goal
          </Button>
        </OrgGoalCreationDialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Folder sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Folders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={selectedFolder === '/' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedFolder('/')}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                All Goals
              </Button>
              {folders.map((folder) => (
                <Button
                  key={folder.path}
                  variant={selectedFolder === folder.path ? 'default' : 'ghost'}
                  className="w-full justify-between"
                  onClick={() => setSelectedFolder(folder.path)}
                >
                  <span className="flex items-center">
                    <FolderOpen className="h-4 w-4 mr-2" />
                    {folder.name}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {folder.count}
                  </Badge>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Goals content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search goals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Goals list */}
          <div className="space-y-4">
            {goals.map((goal) => (
              <Card key={goal.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{goal.title}</h3>
                        <Badge variant={getPriorityColor(goal.priority)}>
                          {goal.priority}
                        </Badge>
                        <Badge variant={getStatusColor(goal.status)}>
                          {goal.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {goal.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {goal.student}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Due {new Date(goal.dueDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <FolderOpen className="h-4 w-4" />
                          {goal.folder}
                        </div>
                      </div>
                    </div>
                    <Target className="h-6 w-6 text-primary flex-shrink-0" />
                  </div>
                  
                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      Edit Goal
                    </Button>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty state */}
          {goals.length === 0 && !isLoading && (
            <Card>
              <CardContent className="text-center py-12">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Goals Created</h3>
                <p className="text-muted-foreground mb-4">
                  Create learning goals to help guide your students' progress.
                </p>
                <OrgGoalCreationDialog organizationId={organizationId}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Goal
                  </Button>
                </OrgGoalCreationDialog>
              </CardContent>
            </Card>
          )}
          
          {/* Loading state */}
          {isLoading && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading goals...</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}