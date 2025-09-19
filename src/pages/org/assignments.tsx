import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssignmentsList } from '@/components/assignments/AssignmentsList';
import { useOrgCatalog } from '@/hooks/useOrgCatalog';
import { CourseCard } from '@/components/courses/CourseCard';
import { AssignmentCreateDialog } from '@/components/assignments/AssignmentCreateDialog';
import { BookOpen, Users, TrendingUp } from 'lucide-react';

export default function AssignmentsPage() {
  const { catalog: catalogData, isLoading } = useOrgCatalog();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-muted-foreground">
            Manage course assignments and track student progress
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Assignments
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Students Enrolled
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">
              +15 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="assignments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="assignments">Current Assignments</TabsTrigger>
          <TabsTrigger value="create">Create Assignment</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-6">
          <AssignmentsList />
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Assignment</CardTitle>
              <p className="text-muted-foreground">
                Select a course from the catalog to assign to your students
              </p>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-48 bg-muted rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Platform Courses */}
                  {catalogData?.platform && catalogData.platform.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Platform Courses</h3>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {catalogData.platform.map((course) => (
                          <CourseCard
                            key={course.id}
                            course={course}
                            showAssignButton={true}
                            onAssign={(selectedCourse) => (
                              <AssignmentCreateDialog course={selectedCourse} />
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Organization Courses */}
                  {catalogData?.org && catalogData.org.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Organization Courses</h3>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {catalogData.org.map((course) => (
                          <CourseCard
                            key={course.id}
                            course={course}
                            showAssignButton={true}
                            onAssign={(selectedCourse) => (
                              <AssignmentCreateDialog course={selectedCourse} />
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {(!catalogData?.platform?.length && !catalogData?.org?.length) && (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No courses available</h3>
                      <p className="text-muted-foreground">
                        There are no courses available to assign at this time
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}