import React, { useState } from 'react';
import { OrgCard, OrgCardContent, OrgCardDescription, OrgCardHeader, OrgCardTitle } from '@/components/organizations/OrgCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Search, Filter, MoreHorizontal, Users, Clock } from 'lucide-react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useCourses } from '@/hooks/useCourses';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function CoursesManagement() {
  const { currentOrg } = useOrgContext();
  const [searchQuery, setSearchQuery] = useState('');
  const { courses, isLoading } = useCourses({ 
    organizationId: currentOrg?.organization_id 
  });

  if (!currentOrg) {
    return (
      <div className="container max-w-6xl mx-auto py-8">
        <OrgCard>
          <OrgCardContent className="p-8 text-center">
            <p className="text-muted-foreground">No organization selected</p>
          </OrgCardContent>
        </OrgCard>
      </div>
    );
  }

  // Filter courses by search query
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const publishedCourses = filteredCourses.filter(c => c.status === 'published');
  const totalEnrollments = filteredCourses.reduce((sum, c) => sum + (c.enrollments_count || 0), 0);
  const avgCompletion = filteredCourses.length > 0 
    ? filteredCourses.reduce((sum, c) => sum + (c.completion_rate || 0), 0) / filteredCourses.length 
    : 0;

  return (
    <div className="container max-w-6xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor your organization's learning content
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Course
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <OrgCard>
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Courses</span>
            </div>
            <div className="text-2xl font-bold mt-2">{filteredCourses.length}</div>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard>
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Published</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-green-600">{publishedCourses.length}</div>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard>
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Enrollments</span>
            </div>
            <div className="text-2xl font-bold mt-2">{totalEnrollments}</div>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard>
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Avg Completion</span>
            </div>
            <div className="text-2xl font-bold mt-2">{Math.round(avgCompletion)}%</div>
          </OrgCardContent>
        </OrgCard>
      </div>

      {/* Search and Filters */}
      <OrgCard>
        <OrgCardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
              placeholder="Search courses..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </OrgCardHeader>
      </OrgCard>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <OrgCard key={course.id} className="overflow-hidden">
            <div className="aspect-video bg-muted">
              <img 
                src={course.thumbnail_url || '/placeholder.svg'} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            <OrgCardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <OrgCardTitle className="text-lg line-clamp-2">{course.title}</OrgCardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Course</DropdownMenuItem>
                    <DropdownMenuItem>View Analytics</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    {course.status === 'draft' ? (
                      <DropdownMenuItem>Publish</DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem>Unpublish</DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="text-destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <OrgCardDescription className="line-clamp-2">
                {course.description}
              </OrgCardDescription>
            </OrgCardHeader>
            <OrgCardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                    {course.status}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    {course.duration_minutes || 0}min
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium">{course.enrollments_count || 0}</div>
                    <div className="text-muted-foreground">Enrolled</div>
                  </div>
                  <div>
                    <div className="font-medium">{Math.round(course.completion_rate || 0)}%</div>
                    <div className="text-muted-foreground">Completed</div>
                  </div>
                </div>
                
                <Button className="w-full" size="sm">
                  Manage Course
                </Button>
              </div>
            </OrgCardContent>
          </OrgCard>
        ))}
      </div>
      
      {/* Empty state */}
      {filteredCourses.length === 0 && !isLoading && (
        <OrgCard>
          <OrgCardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Courses Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No courses match your search.' : 'Create your first course to get started.'}
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          </OrgCardContent>
        </OrgCard>
      )}
    </div>
  );
}