import React from "react";
import { useParams } from "react-router-dom";
import PageShell from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import { useOrgCatalog } from "@/hooks/useOrgCatalog";
import { useOrganizationCourseAssignments } from "@/hooks/useOrganizationCourseAssignments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Users, Clock, Plus, Star, Grid3X3, List, Loader2 } from "lucide-react";
import { CourseCreationWizard } from "@/components/course-builder/CourseCreationWizard";
import { CourseCard as CourseCardType } from "@/types/course-card";

type ViewType = 'grid' | 'list';

export default function CoursesManagementNew() {
  const { orgId } = useParams<{ orgId: string }>();
  const { catalog, isLoading, error, platformCourses, orgCourses } = useOrgCatalog();
  const { assignCourse, isAssigning, isCourseAssigned } = useOrganizationCourseAssignments(orgId);
  const { toast } = useToast();
  const [showCreateWizard, setShowCreateWizard] = React.useState(false);
  const [viewType, setViewType] = React.useState<ViewType>(() => {
    const saved = localStorage.getItem('courses-view-type');
    return (saved as ViewType) || 'grid';
  });
  const [assigningCourses, setAssigningCourses] = React.useState<Set<string>>(new Set());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleViewTypeChange = (type: ViewType) => {
    setViewType(type);
    localStorage.setItem('courses-view-type', type);
  };

  const handleAssignCourse = React.useCallback(async (course: CourseCardType) => {
    if (assigningCourses.has(course.id) || isCourseAssigned(course.id)) {
      return;
    }

    setAssigningCourses(prev => new Set(prev).add(course.id));
    
    try {
      await assignCourse(course.id);
      toast({
        title: "Course Assigned",
        description: `${course.title} has been assigned to your organization.`,
      });
    } catch (error) {
      toast({
        title: "Assignment Failed", 
        description: "Failed to assign course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAssigningCourses(prev => {
        const newSet = new Set(prev);
        newSet.delete(course.id);
        return newSet;
      });
    }
  }, [assignCourse, assigningCourses, isCourseAssigned, toast]);

  const renderCourseCard = (course: CourseCardType, showAssignButton = false) => (
    <Card key={course.id} className="h-56 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
          <div className="flex gap-1">
            {course.badges.map((badge, index) => (
              <Badge 
                key={index}
                variant={badge.variant as any}
                className="text-xs"
              >
                {badge.label}
              </Badge>
            ))}
          </div>
        </div>
        {course.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            <span>{course.difficulty_level || 'All levels'}</span>
          </div>
          {course.duration_minutes && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{course.duration_minutes}min</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>0 students</span>
          </div>
        </div>
        <div className="flex gap-2">
          {showAssignButton ? (
            <Button 
              size="sm" 
              onClick={() => handleAssignCourse(course)}
              disabled={assigningCourses.has(course.id) || isCourseAssigned(course.id)}
            >
              {assigningCourses.has(course.id) ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Assigning...
                </>
              ) : isCourseAssigned(course.id) ? (
                'Already Assigned'
              ) : (
                'Assign Course'
              )}
            </Button>
          ) : (
            <>
              <Button size="sm" variant="outline">Edit</Button>
              <Button size="sm" variant="outline">View</Button>
            </>
          )}
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {course.instructor_name && `Instructor: ${course.instructor_name}`}
        </div>
      </CardContent>
    </Card>
  );

  const renderCourseListItem = (course: CourseCardType, showAssignButton = false) => (
    <TableRow key={course.id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{course.title}</p>
            <p className="text-sm text-muted-foreground line-clamp-1">{course.description}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-1 flex-wrap">
          {course.badges.map((badge, index) => (
            <Badge 
              key={index}
              variant={badge.variant as any}
              className="text-xs"
            >
              {badge.label}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell className="text-sm">
        {course.instructor_name || 'N/A'}
      </TableCell>
      <TableCell className="text-sm">
        {course.duration_minutes ? `${course.duration_minutes}min` : 'N/A'}
      </TableCell>
      <TableCell className="text-sm">
        {course.difficulty_level || 'All levels'}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          {showAssignButton ? (
            <Button 
              size="sm" 
              onClick={() => handleAssignCourse(course)}
              disabled={assigningCourses.has(course.id) || isCourseAssigned(course.id)}
            >
              {assigningCourses.has(course.id) ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Assigning...
                </>
              ) : isCourseAssigned(course.id) ? (
                'Already Assigned'
              ) : (
                'Assign Course'
              )}
            </Button>
          ) : (
            <>
              <Button size="sm" variant="outline">Edit</Button>
              <Button size="sm" variant="outline">View</Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );

  const totalCourses = platformCourses.length + orgCourses.length;
  const publishedCourses = [...platformCourses, ...orgCourses].filter(
    course => course.status === 'published'
  ).length;

  return (
    <PageShell>
      <div className="p-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Courses</h1>
          <div className="flex gap-2">
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                size="sm"
                variant={viewType === 'grid' ? 'default' : 'ghost'}
                onClick={() => handleViewTypeChange('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewType === 'list' ? 'default' : 'ghost'}
                onClick={() => handleViewTypeChange('list')}
                className="h-8 w-8 p-0"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <Button onClick={() => setShowCreateWizard(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Course
            </Button>
            <Button variant="outline">Import</Button>
          </div>
        </header>

        {/* Statistics Cards */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                  <p className="text-2xl font-semibold">{totalCourses}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Platform Courses</p>
                  <p className="text-2xl font-semibold">{platformCourses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Organization Courses</p>
                  <p className="text-2xl font-semibold">{orgCourses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Published</p>
                  <p className="text-2xl font-semibold">{publishedCourses}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-56 animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-8 w-16 bg-muted rounded"></div>
                    <div className="h-8 w-16 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="mt-6 p-6 text-center text-destructive">
            Error loading courses: {error.message}
          </div>
        ) : (
          <div className="space-y-6 mt-6">
            {/* Platform Courses Section */}
            {platformCourses.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">Platform Courses</h2>
                  <Badge variant="secondary">{platformCourses.length}</Badge>
                </div>
                {viewType === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {platformCourses.map((course) => renderCourseCard(course, true))}
                  </div>
                ) : (
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course</TableHead>
                          <TableHead>Tags</TableHead>
                          <TableHead>Instructor</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {platformCourses.map((course) => renderCourseListItem(course, true))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}

            {/* Organization Courses Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Organization Courses</h2>
                <Badge variant="secondary">{orgCourses.length}</Badge>
              </div>
              {viewType === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {orgCourses.map((course) => renderCourseCard(course, false))}
                  
                  {/* Add course card */}
                  <Card 
                    className="h-56 grid place-items-center border-2 border-dashed border-muted hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => setShowCreateWizard(true)}
                  >
                    <div className="text-center">
                      <Plus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="font-medium">Create Course</p>
                      <p className="text-sm text-muted-foreground">Start building your course</p>
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course</TableHead>
                          <TableHead>Tags</TableHead>
                          <TableHead>Instructor</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orgCourses.map((course) => renderCourseListItem(course, false))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Add course button for list view */}
                  <Button 
                    variant="outline" 
                    className="w-full h-16 border-2 border-dashed"
                    onClick={() => setShowCreateWizard(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Course
                  </Button>
                </div>
              )}
            </div>

            {/* No courses message */}
            {totalCourses === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-4">Start by creating your first course or browse platform courses to assign.</p>
                <Button onClick={() => setShowCreateWizard(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Course
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 rounded-xl bg-card/50 backdrop-blur p-4 ring-1 ring-border">
          <h2 className="font-medium mb-3">Quality Indicators</h2>
          <div className="text-muted-foreground text-sm grid place-items-center h-32 border-2 border-dashed border-muted rounded-lg">
            [Confusion Hotspots • Completion Funnel • Release Rules]
          </div>
        </div>
      </div>

      {/* Course Creation Wizard */}
      <CourseCreationWizard
        open={showCreateWizard}
        onOpenChange={setShowCreateWizard}
        orgId={orgId || ''}
      />
    </PageShell>
  );
}