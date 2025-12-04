
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, GraduationCap, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCourses } from '@/hooks/useCourses';
import ModuleManager from '@/components/admin/ModuleManager';

const ModuleManagerPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { courses, isLoading } = useCourses();

  // If no slug is provided, show course selection
  if (!slug) {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard/admin')}
            className="w-fit"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">Module Management</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Select a course to manage its modules
            </p>
          </div>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a course from the list below to manage its modules.
          </AlertDescription>
        </Alert>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading courses...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {courses.map((course) => (
              <Card 
                key={course.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/dashboard/admin/courses/${course.slug}/modules`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base md:text-lg leading-tight truncate">
                        {course.title}
                      </CardTitle>
                      {course.description && (
                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mt-1">
                          {course.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="text-xs text-muted-foreground">
                      {course.instructor_name && (
                        <span>By {course.instructor_name}</span>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full sm:w-auto min-h-[36px] text-xs md:text-sm touch-manipulation"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/admin/courses/${course.slug}/modules`);
                      }}
                    >
                      Manage Modules
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && courses.length === 0 && (
          <div className="text-center py-8 md:py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-base md:text-lg font-medium mb-2">No courses found</h3>
            <p className="text-sm md:text-base text-muted-foreground mb-4">
              Create your first course to start managing modules.
            </p>
            <Button 
              onClick={() => navigate('/dashboard/admin/courses')}
              className="min-h-[44px] text-sm md:text-base touch-manipulation"
            >
              Create Course
            </Button>
          </div>
        )}
      </div>
    );
  }

  // If slug is provided, render the normal ModuleManager
  return <ModuleManager />;
};

export default ModuleManagerPage;
