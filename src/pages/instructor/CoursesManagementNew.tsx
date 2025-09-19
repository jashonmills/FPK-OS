import React from "react";
import { useParams } from "react-router-dom";
import PageShell from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import { useOrgCourses } from "@/hooks/useOrgCourses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Clock, Plus } from "lucide-react";
import { CourseCreationWizard } from "@/components/course-builder/CourseCreationWizard";

export default function CoursesManagementNew() {
  const { orgId } = useParams<{ orgId: string }>();
  const { courses, isLoading, error } = useOrgCourses(orgId);
  const [showCreateWizard, setShowCreateWizard] = React.useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <PageShell>
      <div className="p-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Courses</h1>
          <div className="flex gap-2">
            <Button onClick={() => setShowCreateWizard(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Course
            </Button>
            <Button variant="outline">Import</Button>
          </div>
        </header>

        {isLoading ? (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-48 animate-pulse">
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
          <div className="mt-4 p-6 text-center text-destructive">
            Error loading courses: {error.message}
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Real course cards */}
            {courses?.map((course) => (
              <Card key={course.id} className="h-48 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                    <Badge variant={course.published ? "default" : "secondary"}>
                      {course.published ? "Published" : "Draft"}
                    </Badge>
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
                      <span>{course.level || 'All levels'}</span>
                    </div>
                    {course.duration_estimate_mins && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{course.duration_estimate_mins}min</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>0 students</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Updated {formatDate(course.updated_at)}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add course card */}
            <Card 
              className="h-48 grid place-items-center border-2 border-dashed border-muted hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => setShowCreateWizard(true)}
            >
              <div className="text-center">
                <Plus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="font-medium">Create Course</p>
                <p className="text-sm text-muted-foreground">Start building your course</p>
              </div>
            </Card>
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