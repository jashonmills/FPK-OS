import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Search, Users, Clock, Plus, ExternalLink, Trash2 } from 'lucide-react';
import { useOrganizationCourses, useAvailableCourses, useOrganizationCourseAssignments } from '@/hooks/useOrganizationCourses';

interface CoursesTabProps {
  organizationId: string;
}

export default function CoursesTab({ organizationId }: CoursesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  
  // Fetch organization courses
  const { data: orgCourses, isLoading: isLoadingOrgCourses } = useOrganizationCourses(organizationId);
  const { data: availableCourses, isLoading: isLoadingAvailable } = useAvailableCourses(organizationId);
  const { assignCourse, unassignCourse, isAssigning, isUnassigning } = useOrganizationCourseAssignments();

  if (isLoadingOrgCourses || isLoadingAvailable) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Combine all courses available to the organization with proper typing
  const regularCourses = [
    ...(orgCourses?.assignedCourses || []).map(c => ({ ...c, type: 'assigned' as const })),
    ...(orgCourses?.organizationOwnedCourses || []).map(c => ({ ...c, type: 'owned' as const })),
  ];

  const nativeCourses = [
    ...(orgCourses?.assignedNativeCourses || []).map(c => ({ ...c, type: 'assigned-native' as const })),
    ...(orgCourses?.organizationOwnedNativeCourses || []).map(c => ({ ...c, type: 'owned-native' as const })),
  ];

  const filteredRegularCourses = regularCourses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNativeCourses = nativeCourses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.summary || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Course Management</h2>
          <p className="text-muted-foreground">Assign and manage courses for your students</p>
        </div>
        <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Assign Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Assign Courses to Organization</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="courses" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="courses">Regular Courses</TabsTrigger>
                <TabsTrigger value="native">Native Courses</TabsTrigger>
              </TabsList>
              <TabsContent value="courses" className="space-y-4">
                <div className="grid gap-4">
                  {availableCourses?.courses?.map((course) => (
                    <Card key={course.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{course.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {course.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            {course.duration_minutes && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {course.duration_minutes} mins
                              </span>
                            )}
                            {course.difficulty_level && (
                              <Badge variant="outline">{course.difficulty_level}</Badge>
                            )}
                          </div>
                        </div>
                        <Button 
                          onClick={() => assignCourse.mutate({ 
                            organizationId, 
                            courseId: course.id 
                          })}
                          disabled={isAssigning}
                        >
                          Assign
                        </Button>
                      </div>
                    </Card>
                  ))}
                  {availableCourses?.courses?.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No available courses to assign
                    </p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="native" className="space-y-4">
                <div className="grid gap-4">
                  {availableCourses?.nativeCourses?.map((course) => (
                    <Card key={course.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{course.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {course.summary}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {course.est_minutes} mins
                            </span>
                            <Badge variant="outline">Native Course</Badge>
                          </div>
                        </div>
                        <Button 
                          onClick={() => assignCourse.mutate({ 
                            organizationId, 
                            nativeCourseId: course.id 
                          })}
                          disabled={isAssigning}
                        >
                          Assign
                        </Button>
                      </div>
                    </Card>
                  ))}
                  {availableCourses?.nativeCourses?.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No available native courses to assign
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Courses grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Regular Courses */}
        {filteredRegularCourses.map((course) => (
          <Card key={`regular-${course.id}`} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <BookOpen className="h-8 w-8 text-primary" />
                <div className="flex flex-col gap-1">
                  <Badge variant="secondary">Regular</Badge>
                  {course.type.includes('assigned') && (
                    <Badge variant="outline" className="text-xs">
                      Assigned
                    </Badge>
                  )}
                  {course.type.includes('owned') && (
                    <Badge variant="outline" className="text-xs">
                      Owned
                    </Badge>
                  )}
                </div>
              </div>
              <CardTitle className="text-lg">{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {course.description || 'No description available'}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{course.duration_minutes || 0} minutes</span>
                </div>
                {course.difficulty_level && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{course.difficulty_level}</Badge>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <a href={`/dashboard/learner/course/${course.slug || course.id}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Course
                  </a>
                </Button>
                
                {course.type.includes('assigned') && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => unassignCourse.mutate({ organizationId, courseId: course.id })}
                    disabled={isUnassigning}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Native Courses */}
        {filteredNativeCourses.map((course) => (
          <Card key={`native-${course.id}`} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <BookOpen className="h-8 w-8 text-primary" />
                <div className="flex flex-col gap-1">
                  <Badge variant="default">Native</Badge>
                  {course.type.includes('assigned') && (
                    <Badge variant="outline" className="text-xs">
                      Assigned
                    </Badge>
                  )}
                  {course.type.includes('owned') && (
                    <Badge variant="outline" className="text-xs">
                      Owned
                    </Badge>
                  )}
                </div>
              </div>
              <CardTitle className="text-lg">{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {course.summary || 'No description available'}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{course.est_minutes} minutes</span>
                </div>
                <Badge variant="outline">Native Course</Badge>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <a href={`/dashboard/learner/native-course/${course.slug}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Course
                  </a>
                </Button>
                
                {course.type.includes('assigned') && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => unassignCourse.mutate({ organizationId, nativeCourseId: course.id })}
                    disabled={isUnassigning}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {(filteredRegularCourses.length === 0 && filteredNativeCourses.length === 0) && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? 'No courses match your search' : 'No Courses Available'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Browse and assign courses to help your students learn effectively.'
              }
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowAssignDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Assign Courses
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}