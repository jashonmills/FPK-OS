/**
 * Universal Course Player - Simplified Router
 * 
 * The single entry point for all courses.
 * Fetches course data from database and routes to the appropriate shell.
 * 
 * Project Phoenix: "Flow Factory" - A forced reset to perfection.
 */

import React from 'react';
import { useParams } from 'react-router-dom';
import { useCourses } from '@/hooks/useCourses';
import { SequentialCourseShell } from './SequentialCourseShell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useContextAwareNavigation } from '@/hooks/useContextAwareNavigation';

export const UniversalCoursePlayer: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const { goToCourses } = useContextAwareNavigation();
  
  console.log('[UniversalCoursePlayer] Initializing with slug:', courseSlug);
  
  // Fetch course data from database
  const { courses, isLoading, error } = useCourses({ 
    featured: false, 
    status: 'published',
    limit: 1000 // Get all to find by slug
  });

  console.log('[UniversalCoursePlayer] Hook state:', { 
    coursesCount: courses?.length, 
    isLoading, 
    hasError: !!error 
  });

  // Find the specific course by slug
  const courseData = React.useMemo(() => {
    if (!courses || !courseSlug) {
      console.log('[UniversalCoursePlayer] Missing data:', { hasCourses: !!courses, courseSlug });
      return null;
    }
    
    // Debug: Log all course slugs
    console.log('[UniversalCoursePlayer] Available courses:', courses.map(c => ({ 
      id: c.id, 
      title: c.title, 
      slug: c.slug,
      framework: c.framework_type,
      version: c.content_version
    })));
    
    const found = courses.find(c => c.slug === courseSlug);
    console.log('[UniversalCoursePlayer] Course lookup:', { 
      courseSlug, 
      found: !!found,
      foundId: found?.id,
      foundTitle: found?.title,
      framework: found?.framework_type,
      version: found?.content_version
    });
    return found;
  }, [courses, courseSlug]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="w-12 h-12 mx-auto text-destructive" />
            <h2 className="text-2xl font-bold">Error Loading Course</h2>
            <p className="text-muted-foreground">
              {error.message || 'An error occurred while loading the course.'}
            </p>
            <Button onClick={() => goToCourses()}>
              Back to Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Course not found
  if (!courseData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">Course Not Found</h2>
            <p className="text-muted-foreground">
              The course "{courseSlug}" could not be found. It may have been removed or renamed.
            </p>
            <Button onClick={() => goToCourses()}>
              Back to Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Validate framework_type
  const frameworkType = (courseData as any).framework_type;
  if (!frameworkType) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="w-12 h-12 mx-auto text-yellow-500" />
            <h2 className="text-2xl font-bold">Configuration Error</h2>
            <p className="text-muted-foreground">
              This course is missing framework configuration.
            </p>
            <Button onClick={() => goToCourses()}>
              Back to Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Route to appropriate shell based on framework_type
  switch (frameworkType) {
    case 'sequential':
      return (
        <SequentialCourseShell
          courseData={{
            id: courseData.id,
            title: courseData.title,
            description: courseData.description || '',
            slug: courseSlug || '',
            background_image: courseData.thumbnail_url || undefined,
            estimated_hours: courseData.duration_minutes ? Math.ceil(courseData.duration_minutes / 60) : undefined,
            difficulty_level: (courseData as any).difficulty || 'Beginner',
            content_version: (courseData as any).content_version
          }}
        />
      );

    case 'micro-learning':
      return (
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <AlertCircle className="w-12 h-12 mx-auto text-blue-500" />
              <h2 className="text-2xl font-bold">Micro-Learning Framework</h2>
              <p className="text-muted-foreground">
                Coming in the next phase of Project Phoenix.
              </p>
              <Button onClick={() => goToCourses()}>
                Back to Courses
              </Button>
            </CardContent>
          </Card>
        </div>
      );

    case 'single-embed':
      return (
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <AlertCircle className="w-12 h-12 mx-auto text-blue-500" />
              <h2 className="text-2xl font-bold">Single-Embed Framework</h2>
              <p className="text-muted-foreground">
                Coming in the next phase of Project Phoenix.
              </p>
              <Button onClick={() => goToCourses()}>
                Back to Courses
              </Button>
            </CardContent>
          </Card>
        </div>
      );

    default:
      return (
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <AlertCircle className="w-12 h-12 mx-auto text-destructive" />
              <h2 className="text-2xl font-bold">Unknown Framework</h2>
              <p className="text-muted-foreground">
                Framework type "{frameworkType}" is not supported.
              </p>
              <Button onClick={() => goToCourses()}>
                Back to Courses
              </Button>
            </CardContent>
          </Card>
        </div>
      );
  }
};
