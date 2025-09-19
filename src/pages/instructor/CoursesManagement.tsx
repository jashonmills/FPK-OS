import React, { useState } from 'react';
import { OrgCard, OrgCardContent, OrgCardDescription, OrgCardHeader, OrgCardTitle } from '@/components/organizations/OrgCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Search, Filter, MoreHorizontal, Users, Clock } from 'lucide-react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useCourses } from '@/hooks/useCourses';
import { useOrganizationCourseAssignments } from '@/hooks/useOrganizationCourseAssignments';
import { getCourseImage } from '@/utils/courseImages';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function CoursesManagement() {
  const { currentOrg } = useOrgContext();
  const [searchQuery, setSearchQuery] = useState('');
  const { courses: allCourses, isLoading } = useCourses({ status: 'published' });
  const { assignedCourses, assignCourse, unassignCourse, isCourseAssigned } = useOrganizationCourseAssignments(currentOrg?.organization_id);

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
  const filteredCourses = allCourses.filter(course => 
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
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">Courses</h1>
          <p className="text-white/80 mt-2 drop-shadow">
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
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-white/70" />
              <span className="text-sm font-medium text-white">Total Courses</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-white">{filteredCourses.length}</div>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">Published</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-green-300">{publishedCourses.length}</div>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-white/70" />
              <span className="text-sm font-medium text-white">Total Enrollments</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-white">{totalEnrollments}</div>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">Avg Completion</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-white">{Math.round(avgCompletion)}%</div>
          </OrgCardContent>
        </OrgCard>
      </div>

      {/* Search and Filters */}
      <OrgCard className="bg-orange-500/65 border-orange-400/50">
        <OrgCardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
              <Input 
              placeholder="Search courses..." 
              className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-border text-foreground hover:bg-accent">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </OrgCardHeader>
      </OrgCard>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <OrgCard key={course.id} className="overflow-hidden bg-orange-500/65 border-orange-400/50 flex flex-col">
                <div className="aspect-video relative overflow-hidden">
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${getCourseImage(course.id, course.title)})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <BookOpen className="w-8 h-8 text-white mb-2 drop-shadow-lg" />
                    <h3 className="text-white font-semibold text-lg drop-shadow-md break-words">{course.title}</h3>
                  </div>
                </div>
            <OrgCardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <OrgCardTitle className="text-lg text-white break-words leading-tight">{course.title}</OrgCardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={isCourseAssigned(course.id) ? "bg-green-500/80 text-white" : "bg-gray-500/80 text-white"}>
                    {isCourseAssigned(course.id) ? 'Assigned' : 'Available'}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-orange-500/30">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => isCourseAssigned(course.id) 
                          ? unassignCourse(course.id) 
                          : assignCourse(course.id)
                        }
                      >
                        {isCourseAssigned(course.id) ? 'Remove from Students' : 'Assign to Students'}
                      </DropdownMenuItem>
                      <DropdownMenuItem>View Course Details</DropdownMenuItem>
                      {isCourseAssigned(course.id) && (
                        <DropdownMenuItem>Manage Student Enrollment</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <OrgCardDescription className="text-white/80 text-sm leading-relaxed">
                {course.description}
              </OrgCardDescription>
            </OrgCardHeader>
            <OrgCardContent className="pt-0 flex-1 flex flex-col">
              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between">
                  <Badge variant={course.status === 'published' ? 'default' : 'secondary'} className="bg-orange-600/80 text-white border-orange-500/60">
                    {course.status === 'published' ? 'Published' : 'Draft'}
                  </Badge>
                  <div className="flex items-center text-sm text-white/70">
                    <Clock className="w-3 h-3 mr-1" />
                    {course.duration_minutes || 0}min
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-white">{course.enrollments_count || 0}</div>
                    <div className="text-white/70">Enrolled</div>
                  </div>
                  <div>
                    <div className="font-medium text-white">{Math.round(course.completion_rate || 0)}%</div>
                    <div className="text-white/70">Completed</div>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-orange-600/80 hover:bg-orange-600 text-white border-orange-500/60 mt-auto" 
                size="sm"
                onClick={() => isCourseAssigned(course.id) 
                  ? unassignCourse(course.id) 
                  : assignCourse(course.id)
                }
              >
                {isCourseAssigned(course.id) ? 'Remove Assignment' : 'Assign to Students'}
              </Button>
            </OrgCardContent>
          </OrgCard>
        ))}
      </div>
      
      {/* Empty state */}
      {filteredCourses.length === 0 && !isLoading && (
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-white/70 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-white">No Courses Found</h3>
            <p className="text-white/80 mb-4">
              {searchQuery ? 'No courses match your search.' : 'Create your first course to get started.'}
            </p>
            <Button className="bg-orange-600/80 hover:bg-orange-600 text-white border-orange-500/60">
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          </OrgCardContent>
        </OrgCard>
      )}
    </div>
  );
}