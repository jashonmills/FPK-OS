import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Notebook, Plus, Search, Filter, FileText, Users } from 'lucide-react';
import { useOrgContext } from '@/components/organizations/OrgContext';

export default function NotesManagement() {
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

  // Mock notes data for demonstration
  const mockNotes = [
    {
      id: '1',
      title: 'Weekly Learning Progress Review',
      content: 'Review of student progress across all courses for the week of January 15-22...',
      category: 'progress-report',
      visibility: 'instructor-only',
      tags: ['weekly-review', 'progress', 'assessment'],
      createdAt: '2024-01-22',
      updatedAt: '2024-01-22',
      sharedWith: 0
    },
    {
      id: '2',
      title: 'Student Engagement Strategies',
      content: 'Collection of effective strategies to improve student engagement in online learning...',
      category: 'teaching-resource',
      visibility: 'shared-with-students',
      tags: ['engagement', 'strategies', 'best-practices'],
      createdAt: '2024-01-20',
      updatedAt: '2024-01-21',
      sharedWith: 15
    },
    {
      id: '3',
      title: 'Course Curriculum Updates',
      content: 'Proposed updates to the Learning State curriculum based on recent feedback...',
      category: 'curriculum',
      visibility: 'instructor-only',
      tags: ['curriculum', 'updates', 'feedback'],
      createdAt: '2024-01-18',
      updatedAt: '2024-01-19',
      sharedWith: 0
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'progress-report': return 'default';
      case 'teaching-resource': return 'secondary';
      case 'curriculum': return 'outline';
      default: return 'secondary';
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'shared-with-students': return 'default';
      case 'instructor-only': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
          <p className="text-muted-foreground mt-2">
            Manage instructional notes and resources for your organization
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Note
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Notebook className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Notes</span>
            </div>
            <div className="text-2xl font-bold mt-2">3</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Shared Notes</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-blue-600">1</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Private Notes</span>
            </div>
            <div className="text-2xl font-bold mt-2">2</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">This Week</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-green-600">2</div>
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
                placeholder="Search notes..." 
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

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockNotes.map((note) => (
          <Card key={note.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="space-y-2">
                <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={getCategoryColor(note.category) as any}>
                    {note.category.replace('-', ' ')}
                  </Badge>
                  <Badge variant={getVisibilityColor(note.visibility) as any}>
                    {note.visibility === 'shared-with-students' ? 'shared' : 'private'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <CardDescription className="line-clamp-3 mb-4">
                {note.content}
              </CardDescription>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {note.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              <div className="mt-auto space-y-3">
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(note.createdAt).toLocaleDateString()}
                  <br />
                  Updated: {new Date(note.updatedAt).toLocaleDateString()}
                </div>
                
                {note.visibility === 'shared-with-students' && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    Shared with {note.sharedWith} students
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button size="sm" className="flex-1">
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common note templates and actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <FileText className="w-5 h-5 mb-2" />
              <div className="text-left">
                <div className="font-medium">Progress Report</div>
                <div className="text-xs text-muted-foreground">Weekly student progress summary</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <Notebook className="w-5 h-5 mb-2" />
              <div className="text-left">
                <div className="font-medium">Teaching Resource</div>
                <div className="text-xs text-muted-foreground">Share learning materials</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <Users className="w-5 h-5 mb-2" />
              <div className="text-left">
                <div className="font-medium">Student Feedback</div>
                <div className="text-xs text-muted-foreground">Collect and organize feedback</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}