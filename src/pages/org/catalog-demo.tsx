import React, { useState } from 'react';
import { RequireRole } from '@/components/guards/RequireRole';
import { useOrgCatalog } from '@/hooks/useOrgCatalog';
import { CourseCard } from '@/components/courses/CourseCard';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Search, Building2 } from 'lucide-react';
import type { CourseCard as CourseCardType } from '@/types/course-card';

export default function CatalogDemoPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<CourseCardType | null>(null);

  const { 
    catalog, 
    isLoading, 
    platformCourses, 
    orgCourses,
    error 
  } = useOrgCatalog();

  const handleAssignCourse = (course: CourseCardType) => {
    setSelectedCourse(course);
    console.log('Phase 3 - Assign course:', course);
  };

  if (isLoading) {
    return (
      <RequireRole roles={['instructor', 'owner']}>
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading unified catalog...</p>
            </div>
          </div>
        </div>
      </RequireRole>
    );
  }

  if (error) {
    return (
      <RequireRole roles={['instructor', 'owner']}>
        <div className="container mx-auto py-8">
          <div className="text-center">
            <p className="text-destructive">Error loading catalog: {error.message}</p>
          </div>
        </div>
      </RequireRole>
    );
  }

  return (
    <RequireRole roles={['instructor', 'owner']}>
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Unified Course Catalog Demo</h1>
          <p className="text-muted-foreground">
            Phase 2: Testing the unified CourseCard DTO and catalog system
          </p>
          <div className="flex gap-4 mt-4">
            <Badge variant="secondary">
              Platform: {platformCourses.length}
            </Badge>
            <Badge variant="default">
              Organization: {orgCourses.length}
            </Badge>
            <Badge variant="outline">
              Total: {platformCourses.length + orgCourses.length}
            </Badge>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Platform Courses */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Platform Courses</h2>
            <Badge variant="secondary">{platformCourses.length}</Badge>
          </div>
          
          {platformCourses.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
              <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No platform courses available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {platformCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  showAssignButton={true}
                  onAssign={handleAssignCourse}
                />
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <Separator />

        {/* Organization Courses */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Organization Courses</h2>
            <Badge variant="default">{orgCourses.length}</Badge>
          </div>
          
          {orgCourses.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
              <Building2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No organization courses created yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {orgCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  showAssignButton={true}
                  onAssign={handleAssignCourse}
                />
              ))}
            </div>
          )}
        </div>

        {/* Debug Info */}
        {selectedCourse && (
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Selected Course for Assignment (Phase 3):</h3>
            <pre className="text-sm text-muted-foreground">
              {JSON.stringify(selectedCourse, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </RequireRole>
  );
}