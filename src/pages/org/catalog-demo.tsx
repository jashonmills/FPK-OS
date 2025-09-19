import React, { useState } from 'react';
import { RequireRole } from '@/components/guards/RequireRole';
import { useOrgCatalog } from '@/hooks/useOrgCatalog';
import { EnhancedCourseCard } from '@/components/courses/enhanced/EnhancedCourseCard';
import { EnhancedCourseCardSkeleton } from '@/components/courses/enhanced/EnhancedCourseCardSkeleton';
import { EmptyState } from '@/components/courses/enhanced/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Search, Building2 } from 'lucide-react';
import type { CourseCard as CourseCardType } from '@/types/course-card';
import type { CourseCardModel, CourseCardActions, AssignmentSummary } from '@/types/enhanced-course-card';

export default function CatalogDemoPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<CourseCardType | null>(null);
  const { toast } = useToast();

  const { 
    catalog, 
    isLoading, 
    platformCourses, 
    orgCourses,
    error 
  } = useOrgCatalog();

  // Convert course data to enhanced format
  const convertToEnhancedCourse = (course: CourseCardType): CourseCardModel => ({
    id: course.id,
    orgId: course.org_id,
    title: course.title,
    description: course.description,
    thumbnailUrl: course.thumbnail_url,
    durationMinutes: course.duration_minutes,
    difficulty: course.difficulty_level as 'introductory' | 'intermediate' | 'advanced',
    origin: course.source === 'platform' ? 'platform' : 'organization',
    sourceType: course.source_table === 'courses' ? 'manual' : 'manual', // Simplified for now
    framework: 'framework1', // Default framework
    status: course.status === 'published' ? 'published' : 'draft',
    instructorName: course.instructor_name,
    route: course.route,
    tags: course.tags,
    enrolledCount: 0, // TODO: Get real enrollment count
    avgCompletionPct: 0, // TODO: Get real completion percentage
    isFeatured: false,
    isNew: false,
  });

  // Course Actions
  const createCourseActions = (isOrgCourse: boolean): CourseCardActions => ({
    onPreview: (courseId: string) => {
      console.log('Preview course:', courseId);
      toast({
        title: "Course Preview",
        description: "Opening course preview...",
      });
    },
    
    onAssign: (courseId: string) => {
      const course = [...platformCourses, ...orgCourses].find(c => c.id === courseId);
      if (course) {
        setSelectedCourse(course);
        console.log('Assign course:', course);
        toast({
          title: "Assignment Modal",
          description: "Assignment modal would open here...",
        });
      }
    },

    ...(isOrgCourse && {
      onEdit: (courseId: string) => {
        console.log('Edit course:', courseId);
        toast({
          title: "Edit Course",
          description: "Opening course editor...",
        });
      },

      onPublish: async (courseId: string): Promise<AssignmentSummary> => {
        console.log('Publishing course:', courseId);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const impact = { groupCount: 0, studentCount: 0 };
        toast({
          title: "Course Published",
          description: `Published successfully. Impact: ${impact.groupCount} groups, ${impact.studentCount} students.`,
        });
        return impact;
      },

      onUnpublish: async (courseId: string): Promise<AssignmentSummary> => {
        console.log('Unpublishing course:', courseId);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const impact = { groupCount: 0, studentCount: 0 };
        toast({
          title: "Course Unpublished",
          description: "Unpublished—students keep access until end of day.",
        });
        return impact;
      },

      onDelete: async (courseId: string): Promise<AssignmentSummary> => {
        console.log('Deleting course:', courseId);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const impact = { groupCount: 0, studentCount: 0 };
        toast({
          title: "Course Deleted",
          description: "Course deleted. Analytics retained.",
        });
        return impact;
      },
    }),

    ...(!isOrgCourse && {
      onDuplicateToOrg: (courseId: string) => {
        console.log('Duplicate to org:', courseId);
        toast({
          title: "Course Duplicated",
          description: "Cloned to your organization. Opening editor...",
        });
      },
    }),

    onViewAnalytics: (courseId: string) => {
      console.log('View analytics:', courseId);
      toast({
        title: "Analytics",
        description: "Opening course analytics...",
      });
    },

    onSharePreview: (courseId: string) => {
      console.log('Share preview:', courseId);
      toast({
        title: "Preview Link Generated",
        description: "Preview link copied to clipboard.",
      });
    },

    onAddToCollection: (courseId: string) => {
      console.log('Add to collection:', courseId);
      toast({
        title: "Add to Collection",
        description: "Collection selection modal would open...",
      });
    },
  });

  const handleCreateCourse = () => {
    toast({
      title: "Create Course",
      description: "Course builder would open here...",
    });
  };

  const handleUploadScorm = () => {
    toast({
      title: "Upload SCORM",
      description: "SCORM upload modal would open here...",
    });
  };

  if (isLoading) {
    return (
      <RequireRole roles={['instructor', 'owner']}>
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading course catalog...</p>
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
          <h1 className="text-3xl font-bold mb-2">Course Catalog</h1>
          <p className="text-muted-foreground">
            Discover and assign courses from our platform and your organization
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
            <EmptyState type="platform" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {platformCourses.map((course) => (
                <EnhancedCourseCard
                  key={course.id}
                  course={convertToEnhancedCourse(course)}
                  actions={createCourseActions(false)}
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
            <EmptyState 
              type="organization" 
              onCreateCourse={handleCreateCourse}
              onUploadScorm={handleUploadScorm}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {orgCourses.map((course) => (
                <EnhancedCourseCard
                  key={course.id}
                  course={convertToEnhancedCourse(course)}
                  actions={createCourseActions(true)}
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